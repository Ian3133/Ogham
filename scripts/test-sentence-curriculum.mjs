import { readFileSync } from "node:fs";
import vm from "node:vm";

const context = vm.createContext({ window: {} });
vm.runInContext(readFileSync(new URL("../sentence-curriculum.js", import.meta.url), "utf8"), context);

const curriculum = context.window.OghamSentenceCurriculum;
const expectedCounts = [24, 24, 26, 24, 24, 30, 30, 26, 30, 18];
assert(curriculum.version === 1, "Curriculum version is missing");
assert(curriculum.decks.length === 10, "Curriculum must contain ten decks");

const deckIds = new Set();
const frenchSentences = new Set();
curriculum.decks.forEach((deck, deckIndex) => {
  assert(!deckIds.has(deck.id), `Duplicate deck id: ${deck.id}`);
  deckIds.add(deck.id);
  assert(deck.cards.length === expectedCounts[deckIndex], `${deck.name} has ${deck.cards.length} cards instead of ${expectedCounts[deckIndex]}`);
  assert(deck.initialActive > 0 && deck.initialActive <= deck.cards.length, `${deck.name} has an invalid active batch`);
  deck.cards.forEach((card, cardIndex) => {
    assert(card.french && card.english && card.note, `${deck.name} card ${cardIndex + 1} is incomplete`);
    const key = `${deck.id}|${card.french.toLocaleLowerCase()}`;
    assert(!frenchSentences.has(key), `${deck.name} repeats: ${card.french}`);
    frenchSentences.add(key);
  });
});

assert(curriculum.decks.reduce((sum, deck) => sum + deck.cards.length, 0) === 256, "Curriculum card total changed");
console.log("Sentence curriculum tests passed: 10 decks, 256 cards.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
