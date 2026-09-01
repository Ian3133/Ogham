const maxCaptureLength = 4000;
const captureIdPattern = /^[A-Za-z0-9_-]{1,160}$/;

export async function handleCaptureRequest(event, store, options = {}) {
  const method = event.requestContext?.http?.method || event.httpMethod || "";
  const path = event.rawPath || event.path || "";
  const userId = event.requestContext?.authorizer?.jwt?.claims?.sub
    || event.requestContext?.authorizer?.claims?.sub
    || "";
  const now = options.now || (() => new Date().toISOString());

  if (!userId) {
    return json(401, { message: "Unauthorized" });
  }

  if (method === "POST" && path === "/captures") {
    try {
      const body = parseBody(event);
      const text = validateText(body.text);
      const captureId = validateCaptureId(body.captureId);
      const timestamp = now();
      const capture = {
        captureId,
        text,
        capturedAt: normalizeTimestamp(body.capturedAt, timestamp),
        createdAt: timestamp,
        updatedAt: timestamp,
        schemaVersion: 1
      };
      const saved = await store.create(userId, capture);
      return json(201, { capture: saved });
    } catch (error) {
      return json(error.statusCode || 500, { message: error.message || "Capture could not be saved." });
    }
  }

  if (method === "GET" && path === "/captures") {
    try {
      const query = new URLSearchParams(event.rawQueryString || "");
      const limit = Math.min(100, Math.max(1, Number(query.get("limit")) || 100));
      const cursor = query.get("cursor") || "";
      const result = await store.list(userId, { limit, cursor });
      return json(200, {
        items: result.items || [],
        nextCursor: result.nextCursor || ""
      });
    } catch (error) {
      return json(error.statusCode || 500, { message: error.message || "Captures could not be loaded." });
    }
  }

  if (method === "PATCH" && path.startsWith("/captures/")) {
    try {
      const captureId = validateCaptureId(decodeURIComponent(path.slice("/captures/".length)));
      const body = parseBody(event);
      const changes = {
        text: validateText(body.text),
        updatedAt: now()
      };
      const updated = await store.update(userId, captureId, changes);
      return json(200, { capture: updated });
    } catch (error) {
      return json(error.statusCode || 500, { message: error.message || "Capture could not be updated." });
    }
  }

  if (method === "DELETE" && path.startsWith("/captures/")) {
    try {
      const captureId = validateCaptureId(decodeURIComponent(path.slice("/captures/".length)));
      await store.delete(userId, captureId);
      return { statusCode: 204, headers: corsHeaders(), body: "" };
    } catch (error) {
      return json(error.statusCode || 500, { message: error.message || "Capture could not be deleted." });
    }
  }

  return json(405, { message: "Method not allowed" });
}

function parseBody(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "{}";

  try {
    return JSON.parse(raw);
  } catch {
    throw requestError("Request body must be valid JSON.");
  }
}

function validateText(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw requestError("Enter a word, phrase, or sentence.");
  }
  if (value.length > maxCaptureLength) {
    throw requestError(`Captures can be at most ${maxCaptureLength} characters.`);
  }
  return value;
}

function validateCaptureId(value) {
  if (typeof value !== "string" || !captureIdPattern.test(value)) {
    throw requestError("Capture ID is invalid.");
  }
  return value;
}

function normalizeTimestamp(value, fallback) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : fallback;
}

function requestError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body)
  };
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS"
  };
}
