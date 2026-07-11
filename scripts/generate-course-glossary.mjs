import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const lessonDirectory = join(root, "lessons");
const outputPath = join(root, "glossary", "course-glossary.json");
const checkpointDirectory = join(root, "glossary", ".generated");
const requestedLesson = getArgumentValue("--lesson");
const force = process.argv.includes("--force");
const apiKey = readEnvValue("OPENAI_API_KEY", { allowRaw: true });
const model = readEnvValue("OPENAI_GLOSSARY_MODEL") || "gpt-4o-mini";

async function main() {
  if (!apiKey) {
    throw new Error("Set OPENAI_API_KEY in .env, audio_pipeline/.env, or the shell before generating the glossary.");
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  mkdirSync(checkpointDirectory, { recursive: true });

  const lessons = readdirSync(lessonDirectory)
    .filter((file) => /^lesson-\d+.*\.json$/i.test(file))
    .map((file) => JSON.parse(readFileSync(join(lessonDirectory, file), "utf8")))
    .filter((lesson) => !requestedLesson || lesson.id === requestedLesson)
    .sort((a, b) => getLessonNumber(a.id) - getLessonNumber(b.id));

  if (!lessons.length) {
    throw new Error(requestedLesson ? `No lesson matched ${requestedLesson}.` : "No lesson files were found.");
  }

  for (const lesson of lessons) {
    const checkpointPath = join(checkpointDirectory, `${lesson.id}.json`);

    if (!force && existsSync(checkpointPath)) {
      console.log(`${lesson.id}: using checkpoint`);
      continue;
    }

    console.log(`${lesson.id}: generating ${lesson.lines.length} lines`);
    const generated = await generateLessonGlossary(lesson);
    const normalized = normalizeGeneratedLesson(lesson, generated);
    writeFileSync(checkpointPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  }

  const generatedLessons = readdirSync(checkpointDirectory)
    .filter((file) => /^lesson-\d+\.json$/i.test(file))
    .map((file) => JSON.parse(readFileSync(join(checkpointDirectory, file), "utf8")))
    .sort((a, b) => getLessonNumber(a.lessonId) - getLessonNumber(b.lessonId));

  const glossary = {
    version: 1,
    generatedAt: new Date().toISOString(),
    model,
    lessons: Object.fromEntries(generatedLessons.map((lesson) => [lesson.lessonId, lesson]))
  };

  writeFileSync(outputPath, `${JSON.stringify(glossary, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outputPath} with ${generatedLessons.length} lessons.`);
}

async function generateLessonGlossary(lesson) {
  const input = {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lines: lesson.lines.map((line, lineIndex) => ({
      lineIndex,
      french: line.french,
      english: line.english,
      tokens: tokenizeFrench(line.french).map((term, tokenIndex) => ({ tokenIndex, term }))
    }))
  };
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "french_course_glossary",
          strict: true,
          schema: glossarySchema
        }
      },
      messages: [
        {
          role: "system",
          content: [
            "Create a learner-facing French glossary for every supplied line.",
            "Return one word item for every token, preserving lineIndex and tokenIndex exactly.",
            "Use the French dictionary lemma (infinitive for verbs, masculine singular for adjectives when appropriate).",
            "Give the concise meaning of that form in its sentence and a short grammar label when useful.",
            "Also identify only meaningful multi-token expressions, idioms, phrasal constructions, or terms whose natural meaning is not obvious word by word.",
            "Phrase spans must be contiguous and use the supplied token indices.",
            "For phrases, distinguish a close literal translation from the natural contextual meaning and align each component token with a short literal gloss.",
            "Do not create phrases solely because adjacent words form an ordinary compositional noun phrase."
          ].join(" ")
        },
        { role: "user", content: JSON.stringify(input) }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${response.status} for ${lesson.id}: ${detail.slice(0, 500)}`);
  }

  const payload = await response.json();
  return JSON.parse(payload.choices?.[0]?.message?.content || "{}");
}

function normalizeGeneratedLesson(lesson, generated) {
  const generatedLines = new Map((generated.lines || []).map((line) => [Number(line.lineIndex), line]));

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lines: lesson.lines.map((line, lineIndex) => {
      const terms = tokenizeFrench(line.french);
      const generatedLine = generatedLines.get(lineIndex) || {};
      const wordsByIndex = new Map((generatedLine.words || []).map((word) => [Number(word.tokenIndex), word]));
      const words = terms.map((term, tokenIndex) => {
        const word = wordsByIndex.get(tokenIndex) || {};
        return {
          id: `${lesson.id}:${lineIndex}:w:${tokenIndex}`,
          tokenIndex,
          term,
          lemma: String(word.lemma || term).trim(),
          meaning: String(word.meaning || "").trim(),
          grammar: String(word.grammar || "").trim()
        };
      });
      const phrases = (generatedLine.phrases || [])
        .map((phrase) => normalizePhrase(lesson, lineIndex, terms, phrase))
        .filter(Boolean);

      return {
        lineIndex,
        french: line.french,
        english: line.english,
        words,
        phrases
      };
    })
  };
}

function normalizePhrase(lesson, lineIndex, terms, phrase) {
  const startToken = Number(phrase.startToken);
  const endToken = Number(phrase.endToken);

  if (!Number.isInteger(startToken) || !Number.isInteger(endToken) || startToken < 0 || endToken <= startToken || endToken >= terms.length) {
    return null;
  }

  const componentsByIndex = new Map((phrase.components || []).map((part) => [Number(part.tokenIndex), part]));
  return {
    id: `${lesson.id}:${lineIndex}:p:${startToken}-${endToken}`,
    startToken,
    endToken,
    term: terms.slice(startToken, endToken + 1).join(" "),
    lemma: String(phrase.lemma || terms.slice(startToken, endToken + 1).join(" ")).trim(),
    literalTranslation: String(phrase.literalTranslation || "").trim(),
    meaning: String(phrase.meaning || "").trim(),
    usageNote: String(phrase.usageNote || "").trim(),
    components: terms.slice(startToken, endToken + 1).map((term, offset) => ({
      tokenIndex: startToken + offset,
      term,
      literal: String(componentsByIndex.get(startToken + offset)?.literal || "").trim()
    }))
  };
}

function tokenizeFrench(text = "") {
  return Array.from(text.matchAll(/[\p{L}\p{M}\d]+(?:[’'\-][\p{L}\p{M}\d]+)*/gu), (match) => match[0]);
}

function readEnvValue(name, options = {}) {
  if (process.env[name]) {
    return process.env[name].trim();
  }

  for (const filePath of [join(root, ".env"), join(root, "audio_pipeline", ".env")]) {
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

function getArgumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

function getLessonNumber(id = "") {
  return Number(String(id).match(/\d+/)?.[0] || 0);
}

const glossarySchema = {
  type: "object",
  additionalProperties: false,
  required: ["lines"],
  properties: {
    lines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["lineIndex", "words", "phrases"],
        properties: {
          lineIndex: { type: "integer" },
          words: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["tokenIndex", "lemma", "meaning", "grammar"],
              properties: {
                tokenIndex: { type: "integer" },
                lemma: { type: "string" },
                meaning: { type: "string" },
                grammar: { type: "string" }
              }
            }
          },
          phrases: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["startToken", "endToken", "lemma", "literalTranslation", "meaning", "usageNote", "components"],
              properties: {
                startToken: { type: "integer" },
                endToken: { type: "integer" },
                lemma: { type: "string" },
                literalTranslation: { type: "string" },
                meaning: { type: "string" },
                usageNote: { type: "string" },
                components: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["tokenIndex", "literal"],
                    properties: {
                      tokenIndex: { type: "integer" },
                      literal: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

await main();
