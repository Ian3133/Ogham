import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const DEFAULT_OUTPUT_DIR = new URL("./out/", import.meta.url);
const MAX_CHUNK_LENGTH = 180;

function parseArgs(argv) {
  const args = {
    lang: "fr",
    tld: "fr",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const next = argv[index + 1];

    if (!key.startsWith("--")) {
      throw new Error(`Unexpected argument: ${key}`);
    }

    if (key === "--text" || key === "--input" || key === "--output" || key === "--lang" || key === "--tld") {
      if (!next || next.startsWith("--")) {
        throw new Error(`${key} needs a value.`);
      }
      args[key.slice(2)] = next;
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

function splitText(text) {
  const sentences = text.match(/[^.!?;:]+[.!?;:]?|\S+/g) ?? [text];
  const chunks = [];
  let current = "";

  for (const sentence of sentences.map((part) => part.trim()).filter(Boolean)) {
    if (sentence.length > MAX_CHUNK_LENGTH) {
      if (current) {
        chunks.push(current);
        current = "";
      }

      for (let index = 0; index < sentence.length; index += MAX_CHUNK_LENGTH) {
        chunks.push(sentence.slice(index, index + MAX_CHUNK_LENGTH));
      }
      continue;
    }

    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > MAX_CHUNK_LENGTH) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function outputPathFor(args, text) {
  if (args.output) {
    return resolve(args.output);
  }

  return resolve(DEFAULT_OUTPUT_DIR.pathname, `${slugFromText(text)}.mp3`);
}

async function fetchSpeech(chunk, args) {
  const params = new URLSearchParams({
    ie: "UTF-8",
    client: "tw-ob",
    q: chunk,
    tl: args.lang,
  });
  const url = `https://translate.google.${args.tld}/translate_tts?${params.toString()}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Google TTS request failed with ${response.status} ${response.statusText}.`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const text = await readText(args);

  if (!text) {
    throw new Error("Input text is empty.");
  }

  const chunks = splitText(text);
  const outputPath = outputPathFor(args, text);
  const audioParts = [];

  for (const chunk of chunks) {
    audioParts.push(await fetchSpeech(chunk, args));
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, Buffer.concat(audioParts));
  console.log(`Created ${outputPath}`);
}

main().catch((error) => {
  console.error(`Audio generation failed: ${error.message}`);
  process.exitCode = 1;
});

