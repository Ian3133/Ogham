import { readFileSync } from "node:fs";
import vm from "node:vm";

const context = vm.createContext({
  console,
  Date,
  Math,
  JSON,
  Object,
  Array,
  Number,
  String,
  Boolean,
  Map,
  Set,
  window: { crypto: { randomUUID: () => "uuid" } }
});

vm.runInContext(readFileSync(new URL("../sentence-core.js", import.meta.url), "utf8"), context);
const core = context.window.OghamSentenceCore;

let state = core.emptyState();
({ state } = core.createDeck(state, { name: "Manger", knownThreshold: 8 }, { id: "deck-1", now: "2026-09-26T12:00:00Z" }));
({ state } = core.createDeck(state, { name: "Travel", knownThreshold: 16 }, { id: "deck-2", now: "2026-09-26T12:01:00Z" }));
assert(core.activeDecks(state).length === 2, "Deck creation failed");

({ state } = core.createCard(state, {
  captureId: "capture-1",
  deckId: "deck-1",
  french: "Je mange une pomme.",
  english: "I am eating an apple.",
  note: "Present tense"
}, { id: "card-1", now: "2026-09-26T12:02:00Z" }));
assert(core.isCaptureProcessed(state, "capture-1"), "Processed capture was not tracked");
assert(core.activeCards(state)[0].masteryStreak === 0, "New card did not start at zero");

({ state } = core.rateCard(state, "card-1", "understood", { dayKey: "2026-09-26", now: "2026-09-26T12:03:00Z" }));
assert(core.activeCards(state)[0].masteryStreak === 1, "Understood did not increase the streak");
({ state } = core.rateCard(state, "card-1", "understood", { dayKey: "2026-09-26", now: "2026-09-26T12:04:00Z" }));
({ state } = core.rateCard(state, "card-1", "understood", { dayKey: "2026-09-26", now: "2026-09-26T12:05:00Z" }));
({ state } = core.rateCard(state, "card-1", "understood", { dayKey: "2026-09-26", now: "2026-09-26T12:06:00Z" }));
({ state } = core.rateCard(state, "card-1", "understood", { dayKey: "2026-09-26", now: "2026-09-26T12:07:00Z" }));
assert(core.activeCards(state)[0].masteryStreak === 4, "Understood did not stop at the streak ceiling");
({ state } = core.rateCard(state, "card-1", "neutral", { dayKey: "2026-09-26", now: "2026-09-26T12:08:00Z" }));
assert(core.activeCards(state)[0].masteryStreak === 4, "Neutral changed the streak");
({ state } = core.rateCard(state, "card-1", "missed", { dayKey: "2026-09-26", now: "2026-09-26T12:09:00Z" }));
assert(core.activeCards(state)[0].masteryStreak === 0, "Missed did not reset the streak");
assert(core.getReviewQueue(state, { deckId: "deck-1", dayKey: "2026-09-26" }).length === 0, "Reviewed card returned to today's normal queue");
assert(core.getReviewQueue(state, { deckId: "deck-1", dayKey: "2026-09-26", reviewedTodayOnly: true }).length === 1, "Review-again queue missed today's card");
assert(core.getReviewQueue(state, { deckId: "deck-1", dayKey: "2026-09-27" }).length === 1, "Reviewed card did not return on the next day");

({ state } = core.setKnown(state, "card-1", true, { now: "2026-09-26T12:10:00Z" }));
assert(core.getReviewQueue(state, { deckId: "deck-1" }).length === 0, "Known card stayed in active queue");
assert(core.getReviewQueue(state, { deckId: "deck-1", knownOnly: true }).length === 1, "Known review queue missed card");
({ state } = core.rateCard(state, "card-1", "missed", { reviewingKnown: true, now: "2026-09-26T12:11:00Z" }));
assert(core.activeCards(state)[0].lifecycle === "active", "Known miss did not restore card");

const bulk = core.parseBulkText("Je mange.\tI eat.\nTu manges.\nJe mange.");
assert(bulk.rows.length === 2 && bulk.errors.length === 1, "Bulk parsing did not detect duplicate");

const cloud = core.normalizeState({ ...state, cards: [{ ...state.cards[0], masteryStreak: 2, updatedAt: "2026-09-26T12:12:00Z" }] });
const local = core.normalizeState({ ...state, cards: [{ ...state.cards[0], masteryStreak: 4, updatedAt: "2026-09-26T12:13:00Z" }] });
assert(core.mergeStates(cloud, local).cards[0].masteryStreak === 4, "Newest card did not win merge");
assert(core.getDeckStats(state, "deck-1").active === 1, "Deck stats are incorrect");
const dailyStats = core.getDeckStats(state, "deck-1", { dayKey: "2026-09-26" });
assert(dailyStats.reviewedToday === 1 && dailyStats.remainingToday === 0, "Daily deck stats are incorrect");

const migrated = core.normalizeState({
  cards: [
    { id: "old-low", masteryScore: 0.5 },
    { id: "old-medium", masteryScore: 4 },
    { id: "old-high", masteryScore: 16 }
  ]
});
assert(migrated.cards.map((card) => card.masteryStreak).join(",") === "0,2,4", "Legacy scores did not migrate to streaks");

({ state } = core.createCard(state, {
  deckId: "deck-1",
  french: "Je finirai demain.",
  english: "I will finish tomorrow.",
  lifecycle: "queued"
}, { id: "queued-1", now: "2026-09-26T12:12:00Z" }));
assert(core.getDeckStats(state, "deck-1").queued === 1, "Queued card was not counted");
assert(!core.getReviewQueue(state, { deckId: "deck-1" }).some((card) => card.id === "queued-1"), "Queued card entered review");
({ state } = core.setCardLifecycle(state, "queued-1", "active", { now: "2026-09-26T12:13:00Z" }));
assert(core.getDeckStats(state, "deck-1").queued === 0, "Activated card stayed queued");
assert(core.getReviewQueue(state, { deckId: "deck-1" }).some((card) => card.id === "queued-1"), "Activated card did not enter review");

console.log("Sentence deck core tests passed.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
