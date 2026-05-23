import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_MODEL = "gpt-4o-mini-tts";
const DEFAULT_OUTPUT_DIR = new URL("./audio/", import.meta.url);
const DEFAULT_API_KEY_FILE = new URL("./.env", import.meta.url);
const DEFAULT_FORMAT = "mp3";
const BUILT_IN_VOICES = new Set([
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
]);
const FORMATS = new Set(["mp3", "opus", "aac", "flac", "wav", "pcm"]);

function printHelp() {
  console.log(`French TTS audio generator

Usage:
  node audio_pipeline/make-audio.mjs --text "Bonjour, comment allez-vous ?"
  node audio_pipeline/make-audio.mjs --input audio_pipeline/sample_input.txt --voice marin

Options:
  --text <sentence>        French text to speak
  --input <path>           UTF-8 text file to read instead of --text
  --output <path>          Output audio path
  --voice <name-or-id>     Built-in voice or custom voice ID (default: marin)
  --model <model>          Speech model (default: gpt-4o-mini-tts)
  --format <format>        mp3, opus, aac, flac, wav, or pcm (default: mp3)
  --instructions <text>    Voice style instructions
  --api-key-file <path>    Read API key from a local ignored file
  --list-voices            Print built-in voices
  --help                   Print this help
`);
}

function parseArgs(argv) {
  const args = {
    voice: "marin",
    model: DEFAULT_MODEL,
    format: DEFAULT_FORMAT,
    instructions:
      "Speak naturally in French with clear pronunciation, warm pacing, and a conversational tone.",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const next = argv[index + 1];

    if (key === "--help" || key === "-h") {
      args.help = true;
      continue;
    }

    if (key === "--list-voices") {
      args.listVoices = true;
      continue;
    }

    if (!key.startsWith("--")) {
      throw new Error(`Unexpected argument: ${key}`);
    }

    if (
      [
        "--text",
        "--input",
        "--output",
        "--voice",
        "--model",
        "--format",
        "--instructions",
        "--api-key-file",
      ].includes(key)
    ) {
      if (!next || next.startsWith("--")) {
        throw new Error(`${key} needs a value.`);
      }
      args[key.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = next;
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${key}`);
  }

  return args;
}

async function readText(args) {
  if (args.text && args.input) {
    throw new Error("Use either --text or --input, not both.");
  }

  if (args.text) {
    return args.text.trim();
  }

  if (args.input) {
    return (await readFile(args.input, "utf8")).trim();
  }

  throw new Error("Provide text with --text or a UTF-8 text file with --input.");
}

async function readApiKey(args) {
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY.trim();
  }

  const keyFile = args.apiKeyFile ?? fileURLToPath(DEFAULT_API_KEY_FILE);
  try {
    const raw = (await readFile(keyFile, "utf8")).trim();
    const match = raw.match(/^OPENAI_API_KEY\s*=\s*(.+)$/m);
    return (match ? match[1] : raw).replace(/^["']|["']$/g, "").trim();
  } catch (error) {
    if (error.code !== "ENOENT" || args.apiKeyFile) {
      throw error;
    }
  }

  throw new Error(
    "Missing API key. Set OPENAI_API_KEY, create audio_pipeline/.env, or pass --api-key-file <path>."
  );
}

function slugFromText(text) {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || "french-audio";
}

function outputPathFor(args, text) {
  if (args.output) {
    return resolve(args.output);
  }

  return resolve(fileURLToPath(DEFAULT_OUTPUT_DIR), `${slugFromText(text)}-${args.voice}.${args.format}`);
}

function validateArgs(args) {
  if (!FORMATS.has(args.format)) {
    throw new Error(`Unsupported format: ${args.format}. Use one of: ${[...FORMATS].join(", ")}.`);
  }

  if (args.model !== DEFAULT_MODEL && !BUILT_IN_VOICES.has(args.voice)) {
    console.warn("Custom voice IDs are primarily intended for gpt-4o-mini-tts.");
  }
}

async function fetchSpeech({ apiKey, args, text }) {
  const voice = BUILT_IN_VOICES.has(args.voice) ? args.voice : { id: args.voice };
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: args.model,
      voice,
      input: text,
      instructions: args.instructions,
      response_format: args.format,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI speech request failed with ${response.status}: ${details}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  if (args.listVoices) {
    console.log([...BUILT_IN_VOICES].join("\n"));
    return;
  }

  validateArgs(args);
  const text = await readText(args);
  if (!text) {
    throw new Error("Input text is empty.");
  }

  const apiKey = await readApiKey(args);
  const outputPath = outputPathFor(args, text);
  const audio = await fetchSpeech({ apiKey, args, text });

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, audio);
  console.log(`Created ${outputPath}`);
}

main().catch((error) => {
  console.error(`Audio generation failed: ${error.message}`);
  process.exitCode = 1;
});
