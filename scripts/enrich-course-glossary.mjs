import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const glossaryPath = join(root, "glossary", "course-glossary.json");
const checkpointDirectory = join(root, "glossary", ".enriched");
const requestedLesson = getArgumentValue("--lesson");
const fromLesson = Number(getArgumentValue("--from") || 0);
const force = process.argv.includes("--force");
const apiKey = readEnvValue("OPENAI_API_KEY", { allowRaw: true });
const model = readEnvValue("OPENAI_GLOSSARY_MODEL") || "gpt-4o-mini";

async function main() {
  if (!apiKey) {
    throw new Error("Set OPENAI_API_KEY in .env, audio_pipeline/.env, or the shell before enriching the glossary.");
  }
  if (!existsSync(glossaryPath)) {
    throw new Error("Generate glossary/course-glossary.json first.");
  }

  mkdirSync(checkpointDirectory, { recursive: true });
  const glossary = JSON.parse(readFileSync(glossaryPath, "utf8"));
  const lessons = Object.values(glossary.lessons || {})
    .filter((lesson) => !requestedLesson || lesson.lessonId === requestedLesson)
    .sort((a, b) => getLessonNumber(a.lessonId) - getLessonNumber(b.lessonId));

  if (!lessons.length) {
    throw new Error(requestedLesson ? `No glossary lesson matched ${requestedLesson}.` : "The glossary has no lessons.");
  }

  for (const lesson of lessons) {
    const checkpointPath = join(checkpointDirectory, `${lesson.lessonId}.json`);
    const shouldRegenerate = force || (fromLesson > 0 && getLessonNumber(lesson.lessonId) >= fromLesson);
    if (!shouldRegenerate && existsSync(checkpointPath)) {
      console.log(`${lesson.lessonId}: using enrichment checkpoint`);
      continue;
    }

    console.log(`${lesson.lessonId}: enriching ${lesson.lines.length} lines`);
    const generated = await requestEnrichment(lesson);
    const enriched = mergeEnrichment(lesson, generated);
    writeFileSync(checkpointPath, `${JSON.stringify(enriched, null, 2)}\n`, "utf8");
  }

  const missingCheckpoints = Object.values(glossary.lessons || {}).filter((lesson) => (
    !existsSync(join(checkpointDirectory, `${lesson.lessonId}.json`))
  ));
  if (missingCheckpoints.length) {
    console.log(`Saved checkpoints. ${missingCheckpoints.length} lessons still need enrichment before the final file is replaced.`);
    return;
  }

  const enrichedLessons = Object.values(glossary.lessons || {}).map((lesson) => {
    return JSON.parse(readFileSync(join(checkpointDirectory, `${lesson.lessonId}.json`), "utf8"));
  });
  const enrichedGlossary = {
    ...glossary,
    enrichedAt: new Date().toISOString(),
    enrichmentModel: model,
    lessons: Object.fromEntries(enrichedLessons.map((lesson) => [lesson.lessonId, lesson]))
  };
  writeFileSync(glossaryPath, `${JSON.stringify(enrichedGlossary, null, 2)}\n`, "utf8");
  console.log(`Enriched ${glossaryPath} with ${enrichedLessons.length} lessons.`);
}

async function requestEnrichment(lesson) {
  const lines = [];

  for (let start = 0; start < lesson.lines.length; start += 4) {
    const batch = lesson.lines.slice(start, start + 4);
    console.log(`  ${lesson.lessonId}: lines ${start + 1}-${start + batch.length}`);
    const generated = await requestEnrichmentBatch(lesson, batch);
    lines.push(...(generated.lines || []));
  }

  return { lines };
}

async function requestEnrichmentBatch(lesson, lines) {
  const input = {
    lessonId: lesson.lessonId,
    lessonTitle: lesson.lessonTitle,
    lines: lines.map((line) => ({
      lineIndex: line.lineIndex,
      french: line.french,
      english: line.english,
      tokens: line.words.map((word) => ({
        tokenIndex: word.tokenIndex,
        term: word.term,
        lemma: word.lemma,
        meaning: word.meaning
      })),
      missingMeaningTokenIndices: line.words.filter((word) => !String(word.meaning || "").trim()).map((word) => word.tokenIndex)
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
        json_schema: { name: "french_glossary_enrichment", strict: true, schema: enrichmentSchema }
      },
      messages: [
        {
          role: "system",
          content: [
            "Enrich an existing learner-facing French glossary without rewriting its word records.",
            "For wordFixes, return exactly one concise contextual English meaning for every token index listed in missingMeaningTokenIndices, and no others.",
            "For phrases, identify useful contiguous multi-token learning units: idioms, fixed expressions, common collocations, verb constructions with required prepositions or pronouns, conventional questions/responses, institutional terms, and phrases whose natural meaning differs from a word-by-word reading.",
            "Include zero to four phrases per sentence. Prefer spans of two to six tokens. Never include an unrelated clause, speaker name, or extra surrounding words merely to make a longer span.",
            "For every phrase, copy term exactly from the contiguous supplied French tokens, separated by spaces. startToken and endToken are inclusive: a two-token phrase starting at token 3 ends at token 4.",
            "Before returning each phrase, verify that term exactly equals every supplied token from startToken through endToken, with no missing final token and no unrelated neighboring token.",
            "The literal translation and components must account for the complete selected span; the meaning must be natural English in context.",
            "Return an empty phrase list only when the sentence genuinely contains no useful multi-word learning unit."
          ].join(" ")
        },
        { role: "user", content: JSON.stringify(input) }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI ${response.status} for ${lesson.lessonId}: ${detail.slice(0, 500)}`);
  }

  const payload = await response.json();
  const choice = payload.choices?.[0];
  const content = choice?.message?.content || "";

  if (choice?.finish_reason !== "stop") {
    if (lines.length > 1) {
      const midpoint = Math.ceil(lines.length / 2);
      const first = await requestEnrichmentBatch(lesson, lines.slice(0, midpoint));
      const second = await requestEnrichmentBatch(lesson, lines.slice(midpoint));
      return { lines: [...(first.lines || []), ...(second.lines || [])] };
    }
    throw new Error(`OpenAI response for ${lesson.lessonId} line ${lines[0]?.lineIndex} ended with ${choice?.finish_reason || "no finish reason"}.`);
  }

  try {
    return JSON.parse(content || "{}");
  } catch (error) {
    if (lines.length > 1) {
      const midpoint = Math.ceil(lines.length / 2);
      const first = await requestEnrichmentBatch(lesson, lines.slice(0, midpoint));
      const second = await requestEnrichmentBatch(lesson, lines.slice(midpoint));
      return { lines: [...(first.lines || []), ...(second.lines || [])] };
    }
    throw new Error(`OpenAI returned invalid JSON for ${lesson.lessonId} line ${lines[0]?.lineIndex}: ${error.message}`);
  }
}

function mergeEnrichment(lesson, generated) {
  const generatedLines = new Map((generated.lines || []).map((line) => [Number(line.lineIndex), line]));

  return {
    ...lesson,
    lines: lesson.lines.map((line) => {
      const generatedLine = generatedLines.get(Number(line.lineIndex)) || {};
      const fixes = new Map((generatedLine.wordFixes || []).map((fix) => [Number(fix.tokenIndex), String(fix.meaning || "").trim()]));
      const words = line.words.map((word) => ({
        ...word,
        meaning: String(word.meaning || "").trim() || fixes.get(Number(word.tokenIndex)) || ""
      }));
      const phrases = (generatedLine.phrases || [])
        .map((phrase) => normalizePhrase(lesson, line, phrase))
        .filter(Boolean);

      return { ...line, words, phrases };
    })
  };
}

function normalizePhrase(lesson, line, phrase) {
  const terms = line.words.map((word) => word.term);
  const submittedTerms = tokenizeFrench(phrase.term);
  const exactStart = findTokenSequence(terms, submittedTerms);
  const startToken = exactStart >= 0 ? exactStart : Number(phrase.startToken);
  const endToken = exactStart >= 0 ? exactStart + submittedTerms.length - 1 : Number(phrase.endToken);

  if (!Number.isInteger(startToken) || !Number.isInteger(endToken) || startToken < 0 || endToken <= startToken || endToken >= terms.length) {
    return null;
  }

  const exactTerm = terms.slice(startToken, endToken + 1).join(" ");
  if (normalizeFrench(exactTerm) !== normalizeFrench(phrase.term)) {
    return null;
  }

  const componentList = phrase.components || [];
  const componentsByIndex = new Map(componentList.map((part) => [Number(part.tokenIndex), part]));
  const components = terms.slice(startToken, endToken + 1).map((term, offset) => ({
    tokenIndex: startToken + offset,
    term,
    literal: String(componentsByIndex.get(startToken + offset)?.literal || componentList[offset]?.literal || "").trim()
  }));

  if (components.some((component) => !component.literal)) {
    return null;
  }

  return {
    id: `${lesson.lessonId}:${line.lineIndex}:p:${startToken}-${endToken}`,
    startToken,
    endToken,
    term: exactTerm,
    lemma: String(phrase.lemma || exactTerm).trim(),
    literalTranslation: String(phrase.literalTranslation || "").trim(),
    meaning: String(phrase.meaning || "").trim(),
    usageNote: String(phrase.usageNote || "").trim(),
    components
  };
}

function findTokenSequence(terms, submittedTerms) {
  if (submittedTerms.length < 2) {
    return -1;
  }

  const normalizedTerms = terms.map(normalizeFrench);
  const normalizedSubmitted = submittedTerms.map(normalizeFrench);
  return normalizedTerms.findIndex((term, index) => normalizedSubmitted.every((submitted, offset) => (
    normalizedTerms[index + offset] === submitted
  )));
}

function normalizeFrench(value = "") {
  return String(value).trim().toLocaleLowerCase("fr").replace(/[’`]/g, "'");
}

function tokenizeFrench(text = "") {
  return Array.from(String(text).matchAll(/[\p{L}\p{M}\d]+(?:[’'\-][\p{L}\p{M}\d]+)*/gu), (match) => match[0]);
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

const enrichmentSchema = {
  type: "object",
  additionalProperties: false,
  required: ["lines"],
  properties: {
    lines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["lineIndex", "wordFixes", "phrases"],
        properties: {
          lineIndex: { type: "integer" },
          wordFixes: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["tokenIndex", "meaning"],
              properties: { tokenIndex: { type: "integer" }, meaning: { type: "string" } }
            }
          },
          phrases: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["term", "startToken", "endToken", "lemma", "literalTranslation", "meaning", "usageNote", "components"],
              properties: {
                term: { type: "string" },
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
                    properties: { tokenIndex: { type: "integer" }, literal: { type: "string" } }
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
