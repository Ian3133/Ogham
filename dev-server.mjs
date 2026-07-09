import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 8000);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function getFilePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const cleanPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = resolve(root, `.${sep}${cleanPath}`);

  if (!requestedPath.startsWith(root)) {
    return null;
  }

  if (!existsSync(requestedPath)) {
    return null;
  }

  if (statSync(requestedPath).isDirectory()) {
    return join(requestedPath, "index.html");
  }

  return requestedPath;
}

function readLocalEnvValue(name, options = {}) {
  if (process.env[name]) {
    return process.env[name].trim();
  }

  for (const filePath of [resolve(root, ".env"), resolve(root, "audio_pipeline", ".env")]) {
    if (!existsSync(filePath)) {
      continue;
    }

    const raw = readFileSync(filePath, "utf8").trim();
    const match = raw.match(new RegExp(`^${name}\\s*=\\s*(.+)$`, "m"));
    const value = match ? match[1] : (options.allowRaw ? raw : "");

    if (value) {
      return value.replace(/^["']|["']$/g, "").trim();
    }
  }

  return "";
}

function readJsonBody(request, limit = 24_000) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > limit) {
        rejectBody(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolveBody(body ? JSON.parse(body) : {});
      } catch (error) {
        rejectBody(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", rejectBody);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

async function handleDictionaryGloss(request, response) {
  const apiKey = readLocalEnvValue("OPENAI_API_KEY", { allowRaw: true });

  if (!apiKey) {
    sendJson(response, 503, { error: "Missing OPENAI_API_KEY in shell env, .env, or audio_pipeline/.env." });
    return;
  }

  try {
    const context = await readJsonBody(request);
    const model = readLocalEnvValue("OPENAI_GLOSS_MODEL") || "gpt-4o-mini";
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a concise French tutor. Return only JSON with literalTranslation, meaningTranslation, and usageNote. Explain the selected term in the context of the full sentence."
          },
          {
            role: "user",
            content: JSON.stringify({
              selected: context.term,
              frenchSentence: context.sourceSentence,
              englishSentence: context.englishSentence,
              lessonTitle: context.lessonTitle
            })
          }
        ]
      })
    });

    if (!openAiResponse.ok) {
      const details = await openAiResponse.text();
      sendJson(response, 502, { error: `OpenAI request failed: ${openAiResponse.status}`, details });
      return;
    }

    const payload = await openAiResponse.json();
    const text = payload.choices?.[0]?.message?.content || "{}";
    const gloss = JSON.parse(text);

    sendJson(response, 200, {
      literalTranslation: gloss.literalTranslation || "",
      meaningTranslation: gloss.meaningTranslation || "",
      usageNote: gloss.usageNote || ""
    });
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Dictionary gloss failed." });
  }
}

createServer((request, response) => {
  if (request.method === "POST" && request.url?.split("?")[0] === "/dictionary/gloss") {
    handleDictionaryGloss(request, response);
    return;
  }

  const filePath = getFilePath(request.url || "/");

  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream"
  });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`Local server running at http://localhost:${port}/`);
});
