import { mkdirSync, readFileSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const outputRoot = resolve(process.argv[2] || join(root, ".ua", "sentence-audio", "v1"));
const concurrency = Math.max(1, Math.min(12, Number(process.env.OGHAM_AUDIO_CONCURRENCY) || 6));
const aws = process.platform === "win32" ? "C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe" : "aws";
const context = { window: {} };

vm.runInNewContext(readFileSync(join(root, "sentence-curriculum.js"), "utf8"), context);
const decks = context.window.OghamSentenceCurriculum.decks;
const jobs = decks.flatMap((deck) => deck.cards.map((card, index) => ({
  id: `${deck.id}-card-${String(index + 1).padStart(2, "0")}`,
  french: card.french
})));

mkdirSync(outputRoot, { recursive: true });
let nextIndex = 0;
let completed = 0;

async function synthesize(job) {
  const outputPath = join(outputRoot, `${job.id}.mp3`);
  try {
    if (statSync(outputPath).size > 0) return;
  } catch {}

  await new Promise((resolveJob, rejectJob) => {
    const child = spawn(aws, [
      "polly", "synthesize-speech",
      "--engine", "generative",
      "--language-code", "fr-FR",
      "--voice-id", "Lea",
      "--output-format", "mp3",
      "--text", job.french,
      "--region", "us-east-1",
      outputPath
    ], { stdio: ["ignore", "ignore", "pipe"] });
    let error = "";
    child.stderr.on("data", (chunk) => { error += chunk.toString(); });
    child.on("error", rejectJob);
    child.on("exit", (code) => code === 0 ? resolveJob() : rejectJob(new Error(`${job.id}: ${error.trim() || `AWS exited ${code}`}`)));
  });
}

async function worker() {
  while (nextIndex < jobs.length) {
    const job = jobs[nextIndex];
    nextIndex += 1;
    await synthesize(job);
    completed += 1;
    if (completed % 10 === 0 || completed === jobs.length) {
      process.stdout.write(`Generated ${completed}/${jobs.length}\n`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log(`Sentence audio ready in ${outputRoot}`);
