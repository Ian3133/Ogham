import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { handleCaptureRequest } from "./capture-http.mjs";

const tableName = process.env.USER_STATE_TABLE || "OghamUserState";
const captureTableName = process.env.CAPTURE_TABLE || "OghamCaptures";
const openAiSecretId = process.env.OPENAI_SECRET_ID || "odrerir/openai";
const openAiModel = process.env.OPENAI_GLOSS_MODEL || "gpt-4o-mini";
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const secrets = new SecretsManagerClient({});
let cachedOpenAiKey = "";
const captureStore = createCaptureStore();

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,PUT,POST,PATCH,DELETE,OPTIONS"
  },
  body: JSON.stringify(body)
});

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;
  const path = event.rawPath || event.path || "";

  if (method === "OPTIONS") {
    return json(200, {});
  }

  const claims = event.requestContext?.authorizer?.jwt?.claims || event.requestContext?.authorizer?.claims || {};
  const userId = claims.sub;
  const email = claims.email;

  if (!userId) {
    return json(401, { message: "Unauthorized" });
  }

  try {
    if (path === "/captures" || path.startsWith("/captures/")) {
      return await handleCaptureRequest(event, captureStore);
    }

    if (method === "POST" && path === "/dictionary/gloss") {
      return await handleDictionaryGloss(event);
    }

    if (method === "GET" && path === "/state") {
      const result = await dynamo.send(new GetCommand({
        TableName: tableName,
        Key: { userId }
      }));
      return json(200, { state: result.Item || null });
    }

    if (method === "PUT" && path === "/state") {
      const body = parseBody(event);
      const { userId: ignoredUserId, email: ignoredEmail, updatedAt: ignoredUpdatedAt, ...snapshot } = body;
      const item = {
        ...snapshot,
        userId,
        email,
        stateVersion: Math.max(2, Number(snapshot.stateVersion) || 0),
        updatedAt: new Date().toISOString()
      };

      await dynamo.send(new PutCommand({ TableName: tableName, Item: item }));
      return json(200, { state: item });
    }

    return json(405, { message: "Method not allowed" });
  } catch (error) {
    console.error("OghamUserStateApi failed", { method, path, message: error.message });
    return json(500, { message: "Request failed" });
  }
};

function createCaptureStore() {
  return {
    async create(userId, capture) {
      const item = { userId, ...capture };

      try {
        await dynamo.send(new PutCommand({
          TableName: captureTableName,
          Item: item,
          ConditionExpression: "attribute_not_exists(userId) AND attribute_not_exists(captureId)"
        }));
        return withoutUserId(item);
      } catch (error) {
        if (error.name !== "ConditionalCheckFailedException") {
          throw error;
        }

        const existing = await dynamo.send(new GetCommand({
          TableName: captureTableName,
          Key: { userId, captureId: capture.captureId }
        }));
        if (existing.Item?.text === capture.text) {
          return withoutUserId(existing.Item);
        }

        throw httpError("Capture ID already exists.", 409);
      }
    },

    async list(userId, options = {}) {
      const exclusiveStartKey = decodeCaptureCursor(options.cursor, userId);
      const result = await dynamo.send(new QueryCommand({
        TableName: captureTableName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId },
        ScanIndexForward: false,
        Limit: options.limit || 100,
        ExclusiveStartKey: exclusiveStartKey
      }));
      return {
        items: (result.Items || []).map(withoutUserId),
        nextCursor: encodeCaptureCursor(result.LastEvaluatedKey)
      };
    },

    async update(userId, captureId, changes) {
      try {
        const result = await dynamo.send(new UpdateCommand({
          TableName: captureTableName,
          Key: { userId, captureId },
          UpdateExpression: "SET #text = :text, updatedAt = :updatedAt",
          ExpressionAttributeNames: { "#text": "text" },
          ExpressionAttributeValues: {
            ":text": changes.text,
            ":updatedAt": changes.updatedAt
          },
          ConditionExpression: "attribute_exists(userId) AND attribute_exists(captureId)",
          ReturnValues: "ALL_NEW"
        }));
        return withoutUserId(result.Attributes);
      } catch (error) {
        if (error.name === "ConditionalCheckFailedException") {
          throw httpError("Capture not found.", 404);
        }
        throw error;
      }
    },

    async delete(userId, captureId) {
      await dynamo.send(new DeleteCommand({
        TableName: captureTableName,
        Key: { userId, captureId }
      }));
    }
  };
}

function withoutUserId(item = {}) {
  const { userId: ignoredUserId, ...capture } = item;
  return capture;
}

function encodeCaptureCursor(key) {
  return key ? Buffer.from(JSON.stringify(key), "utf8").toString("base64url") : "";
}

function decodeCaptureCursor(cursor, userId) {
  if (!cursor) {
    return undefined;
  }

  try {
    const key = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
    return key?.userId === userId && key.captureId ? key : undefined;
  } catch {
    return undefined;
  }
}

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseBody(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "{}";
  return JSON.parse(raw);
}

async function handleDictionaryGloss(event) {
  const body = parseBody(event);
  const apiKey = await getOpenAiKey();
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: openAiModel,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a concise French tutor. Return only JSON with literalTranslation, meaningTranslation, and usageNote. Explain the selected term in the supplied sentence."
        },
        {
          role: "user",
          content: JSON.stringify({
            selected: body.term,
            frenchSentence: body.sourceSentence,
            englishSentence: body.englishSentence,
            lessonTitle: body.lessonTitle
          })
        }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("OpenAI gloss failed", { status: response.status, details: details.slice(0, 500) });
    return json(502, { message: "Gloss service unavailable" });
  }

  const payload = await response.json();
  const gloss = JSON.parse(payload.choices?.[0]?.message?.content || "{}");
  return json(200, {
    literalTranslation: gloss.literalTranslation || "",
    meaningTranslation: gloss.meaningTranslation || "",
    usageNote: gloss.usageNote || ""
  });
}

async function getOpenAiKey() {
  if (cachedOpenAiKey) {
    return cachedOpenAiKey;
  }

  const result = await secrets.send(new GetSecretValueCommand({ SecretId: openAiSecretId }));
  const secret = result.SecretString || "";

  try {
    const parsed = JSON.parse(secret);
    cachedOpenAiKey = parsed.OPENAI_API_KEY || parsed.openaiApiKey || parsed.apiKey || "";
  } catch {
    const match = secret.match(/OPENAI_API_KEY\s*=\s*(.+)/);
    cachedOpenAiKey = match ? match[1].trim() : secret.trim();
  }

  if (!cachedOpenAiKey) {
    throw new Error("OpenAI key was not found in the configured secret.");
  }
  return cachedOpenAiKey;
}
