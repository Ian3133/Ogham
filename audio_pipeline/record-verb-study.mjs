// Generate reusable French recordings for the study workbook. Resume by rerunning.
// node audio_pipeline/record-verb-study.mjs --plan
// node audio_pipeline/record-verb-study.mjs --concurrency 12
import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "audio/verb-study");
const model = "gpt-4o-mini-tts";
const voice = "marin";
const instructions = "Parlez uniquement en français de France, comme une professeure patiente. Prononciation native, claire et naturelle, à un rythme légèrement lent. Lisez exactement le texte fourni, une seule fois, sans introduction ni explication. Respectez les liaisons et les terminaisons muettes.";
const normalize = (text) => String(text).normalize("NFC").replace(/[’']/g, "’").replace(/\s+/g, " ").trim();
const corpus = JSON.parse(await readFile(resolve(root, "verb-study-data.json"), "utf8"));
const texts = new Set();
const pilot = corpus.records.filter((record) => record.verb === "Manger" && record.topic === "Présent");
for (const record of [...pilot, ...corpus.records]) {
  if (record.form) texts.add(normalize(record.form));
  for (const variant of record.variants) {
    texts.add(normalize(variant.sentence));
    for (const part of variant.parts) texts.add(normalize(part.text));
  }
}
const jobs = [...texts].filter(Boolean).map((text) => ({ text, file: `${createHash("sha256").update(JSON.stringify([model, voice, instructions, text])).digest("hex").slice(0, 24)}.mp3` }));
const plan = { model, voice, instructions, records: corpus.records.length, clips: jobs.length, characters: jobs.reduce((sum, job) => sum + job.text.length, 0) };
if (process.argv.includes("--plan")) {
  console.log(JSON.stringify(plan));
  process.exit(0);
}

async function apiKey() {
  if (process.env.OPENAI_API_KEY?.trim()) return process.env.OPENAI_API_KEY.trim();
  for (const path of [resolve(root, "audio_pipeline/.env"), resolve(root, ".env")]) {
    try {
      const raw = (await readFile(path, "utf8")).trim();
      const value = raw.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m)?.[1] || (/^sk-/.test(raw) ? raw : "");
      if (value) return value.replace(/^["']|["']$/g, "").trim();
    } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  throw new Error("No local OpenAI API key is configured.");
}

await mkdir(output, { recursive: true });
const key = await apiKey();
const recordings = {};
const pending = [];
for (const job of jobs) {
  const path = resolve(output, job.file);
  try {
    if ((await stat(path)).size > 1000) { recordings[job.text] = `audio/verb-study/${job.file}`; continue; }
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  pending.push(job);
}
const manifest = () => ({ ...plan, recorded: Object.keys(recordings).length, generatedAt: new Date().toISOString(), recordings });
let saving = Promise.resolve();
function save() {
  const value = JSON.stringify(manifest(), null, 2) + "\n";
  saving = saving.then(() => writeFile(resolve(output, "manifest.json"), value));
  return saving;
}
await save();
console.log(JSON.stringify({ ...plan, existing: Object.keys(recordings).length, pending: pending.length }));
const concurrencyIndex = process.argv.indexOf("--concurrency");
const concurrency = concurrencyIndex >= 0 ? Math.min(16, Math.max(1, Number(process.argv[concurrencyIndex + 1]) || 8)) : 8;
let next = 0;
let completed = 0;
let halted = false;
const failures = [];
const started = Date.now();
const pause = (ms) => new Promise((resolvePause) => setTimeout(resolvePause, ms));

async function record(job) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    let response;
    try {
      response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, voice, input: job.text, instructions, response_format: "mp3" }),
        signal: AbortSignal.timeout(120000)
      });
    } catch (error) {
      if (attempt === 4) throw new Error(`Speech connection failed for ${job.file}: ${error.cause?.code || error.name}`);
      await pause(1500 * (attempt + 1));
      continue;
    }
    if (!response.ok) {
      const details = await response.json().catch(() => ({}));
      const code = details.error?.code || response.status;
      if ([401, 403].includes(response.status) || code === "insufficient_quota") {
        halted = true;
        throw new Error(`Speech service rejected generation (${code}).`);
      }
      if ((response.status === 429 || response.status >= 500) && attempt < 4) {
        await pause(Math.max(2000 * (attempt + 1), Number(response.headers.get("retry-after") || 0) * 1000));
        continue;
      }
      throw new Error(`Speech service returned ${code} for ${job.file}.`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1000) throw new Error(`Incomplete speech file ${job.file}.`);
    await writeFile(resolve(output, job.file), bytes);
    recordings[job.text] = `audio/verb-study/${job.file}`;
    return;
  }
}

await Promise.all(Array.from({ length: concurrency }, async () => {
  while (!halted && next < pending.length) {
    const job = pending[next++];
    try { await record(job); }
    catch (error) { failures.push({ file: job.file, message: error.message }); console.error(error.message); }
    completed += 1;
    if (completed % 10 === 0) {
      await save();
      console.log(JSON.stringify({ completed, remaining: pending.length - next, recorded: Object.keys(recordings).length, failed: failures.length, seconds: Math.round((Date.now() - started) / 1000) }));
    }
  }
}));
await save();
console.log(JSON.stringify({ complete: Object.keys(recordings).length === jobs.length, recorded: Object.keys(recordings).length, expected: jobs.length, failures }));
if (Object.keys(recordings).length !== jobs.length) process.exitCode = 1;
