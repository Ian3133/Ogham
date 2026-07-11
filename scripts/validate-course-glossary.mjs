import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const glossary = JSON.parse(readFileSync(join(root, "glossary", "course-glossary.json"), "utf8"));
const sourceLessons = readdirSync(join(root, "lessons"))
  .filter((file) => /^lesson-\d+.*\.json$/i.test(file))
  .map((file) => JSON.parse(readFileSync(join(root, "lessons", file), "utf8")));
const errors = [];
const warnings = [];
const ids = new Set();
let lineCount = 0;
let wordCount = 0;
let phraseCount = 0;

for (const lesson of sourceLessons) {
  const glossaryLesson = glossary.lessons?.[lesson.id];
  if (!glossaryLesson) {
    errors.push(`${lesson.id}: missing glossary lesson`);
    continue;
  }
  if ((glossaryLesson.lines || []).length !== lesson.lines.length) {
    errors.push(`${lesson.id}: expected ${lesson.lines.length} lines, found ${(glossaryLesson.lines || []).length}`);
  }

  lesson.lines.forEach((sourceLine, lineIndex) => {
    lineCount += 1;
    const line = glossaryLesson.lines?.find((item) => Number(item.lineIndex) === lineIndex);
    const tokens = tokenizeFrench(sourceLine.french);
    if (!line) {
      errors.push(`${lesson.id}:${lineIndex}: missing line`);
      return;
    }

    const words = line.words || [];
    wordCount += words.length;
    if (words.length !== tokens.length) {
      errors.push(`${lesson.id}:${lineIndex}: expected ${tokens.length} words, found ${words.length}`);
    }
    tokens.forEach((term, tokenIndex) => {
      const word = words.find((item) => Number(item.tokenIndex) === tokenIndex);
      if (!word) {
        errors.push(`${lesson.id}:${lineIndex}: missing token ${tokenIndex} (${term})`);
        return;
      }
      if (word.term !== term) {
        errors.push(`${lesson.id}:${lineIndex}:${tokenIndex}: expected term ${term}, found ${word.term}`);
      }
      if (!String(word.lemma || "").trim() || !String(word.meaning || "").trim()) {
        errors.push(`${lesson.id}:${lineIndex}:${tokenIndex}: blank lemma or meaning for ${term}`);
      }
      checkId(word.id, `${lesson.id}:${lineIndex}:${tokenIndex}`);
    });

    (line.phrases || []).forEach((phrase) => {
      phraseCount += 1;
      const start = Number(phrase.startToken);
      const end = Number(phrase.endToken);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end >= tokens.length) {
        errors.push(`${lesson.id}:${lineIndex}: invalid phrase span ${start}-${end}`);
        return;
      }
      const expectedTerm = tokens.slice(start, end + 1).join(" ");
      if (phrase.term !== expectedTerm) {
        errors.push(`${lesson.id}:${lineIndex}: phrase term mismatch; expected ${expectedTerm}, found ${phrase.term}`);
      }
      if (!String(phrase.literalTranslation || "").trim() || !String(phrase.meaning || "").trim()) {
        errors.push(`${lesson.id}:${lineIndex}: blank phrase translation for ${expectedTerm}`);
      }
      if ((phrase.components || []).length !== end - start + 1 || phrase.components.some((part) => !String(part.literal || "").trim())) {
        errors.push(`${lesson.id}:${lineIndex}: incomplete literal components for ${expectedTerm}`);
      }
      checkId(phrase.id, `${lesson.id}:${lineIndex}:${expectedTerm}`);
    });
  });
}

if (phraseCount < Math.ceil(lineCount * 0.2)) {
  warnings.push(`Only ${phraseCount} phrases were generated for ${lineCount} lines; review phrase coverage.`);
}

console.log(`Validated ${sourceLessons.length} lessons, ${lineCount} lines, ${wordCount} words, and ${phraseCount} phrases.`);
warnings.forEach((warning) => console.warn(`Warning: ${warning}`));
if (errors.length) {
  errors.slice(0, 50).forEach((error) => console.error(`Error: ${error}`));
  if (errors.length > 50) {
    console.error(`...and ${errors.length - 50} more errors.`);
  }
  process.exitCode = 1;
} else {
  console.log("Glossary structure and required content are valid.");
}

function checkId(id, location) {
  if (!id) {
    errors.push(`${location}: missing id`);
  } else if (ids.has(id)) {
    errors.push(`${location}: duplicate id ${id}`);
  } else {
    ids.add(id);
  }
}

function tokenizeFrench(text = "") {
  return Array.from(text.matchAll(/[\p{L}\p{M}\d]+(?:[’'\-][\p{L}\p{M}\d]+)*/gu), (match) => match[0]);
}
