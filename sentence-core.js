(function attachSentenceCore(root) {
  const defaultKnownThreshold = 8;
  const minimumMasteryScore = 0.25;
  const maximumSentenceLength = 4000;

  function emptyState() {
    return {
      version: 1,
      decks: [],
      cards: [],
      drafts: [],
      processedCaptures: {}
    };
  }

  function normalizeState(value = {}) {
    const state = emptyState();
    state.decks = normalizeEntities(value.decks, normalizeDeck);
    state.cards = normalizeEntities(value.cards, normalizeCard);
    state.drafts = normalizeEntities(value.drafts, normalizeDraft);
    state.processedCaptures = normalizeProcessedCaptures(value.processedCaptures);
    return state;
  }

  function mergeStates(cloudState = {}, localState = {}) {
    const cloud = normalizeState(cloudState);
    const local = normalizeState(localState);

    return {
      version: 1,
      decks: mergeEntities(cloud.decks, local.decks),
      cards: mergeEntities(cloud.cards, local.cards),
      drafts: mergeEntities(cloud.drafts, local.drafts),
      processedCaptures: mergeProcessedCaptures(cloud.processedCaptures, local.processedCaptures)
    };
  }

  function createDeck(state, input, options = {}) {
    const current = normalizeState(state);
    const name = String(input?.name || "").trim();
    if (!name) throw new Error("Enter a deck name.");
    if (activeDecks(current).some((deck) => deck.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      throw new Error("A deck with that name already exists.");
    }

    const timestamp = getTimestamp(options.now);
    const deck = normalizeDeck({
      id: options.id || createId("deck"),
      name,
      knownThreshold: normalizeThreshold(input.knownThreshold),
      order: activeDecks(current).length,
      archived: false,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    current.decks.push(deck);
    return { state: current, deck };
  }

  function updateDeck(state, deckId, changes = {}, options = {}) {
    const current = normalizeState(state);
    const index = current.decks.findIndex((deck) => deck.id === deckId && !deck.deletedAt);
    if (index < 0) throw new Error("Deck not found.");
    const name = changes.name === undefined ? current.decks[index].name : String(changes.name || "").trim();
    if (!name) throw new Error("Enter a deck name.");
    if (activeDecks(current).some((deck) => deck.id !== deckId && deck.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      throw new Error("A deck with that name already exists.");
    }
    current.decks[index] = normalizeDeck({
      ...current.decks[index],
      name,
      knownThreshold: changes.knownThreshold === undefined
        ? current.decks[index].knownThreshold
        : normalizeThreshold(changes.knownThreshold),
      archived: changes.archived === undefined ? current.decks[index].archived : Boolean(changes.archived),
      updatedAt: getTimestamp(options.now)
    });
    return { state: current, deck: current.decks[index] };
  }

  function deleteDeck(state, deckId, options = {}) {
    const current = normalizeState(state);
    if (activeCards(current).some((card) => card.deckId === deckId)) {
      throw new Error("Move or delete the sentences in this deck first.");
    }
    const index = current.decks.findIndex((deck) => deck.id === deckId && !deck.deletedAt);
    if (index < 0) throw new Error("Deck not found.");
    const timestamp = getTimestamp(options.now);
    current.decks[index] = { ...current.decks[index], deletedAt: timestamp, updatedAt: timestamp };
    return current;
  }

  function saveDraft(state, input, options = {}) {
    const current = normalizeState(state);
    const captureId = String(input?.captureId || "").trim();
    if (!captureId) throw new Error("Capture ID is required.");
    const timestamp = getTimestamp(options.now);
    const existing = current.drafts.findIndex((draft) => draft.id === captureId);
    const draft = normalizeDraft({
      id: captureId,
      english: String(input.english || "").trim(),
      note: String(input.note || "").trim(),
      sourceType: input.sourceType || "capture",
      updatedAt: timestamp
    });
    if (existing >= 0) current.drafts[existing] = draft;
    else current.drafts.push(draft);
    return current;
  }

  function createCard(state, input, options = {}) {
    const current = normalizeState(state);
    const french = validateSentence(input?.french, "Enter the French sentence.");
    const english = validateSentence(input?.english, "Confirm the English meaning.");
    const deck = activeDecks(current).find((item) => item.id === input.deckId);
    if (!deck) throw new Error("Choose a deck.");
    const timestamp = getTimestamp(options.now);
    const captureId = String(input.captureId || "").trim();
    const card = normalizeCard({
      id: options.id || createId("sentence"),
      deckId: deck.id,
      french,
      english,
      note: String(input.note || "").trim(),
      masteryScore: 1,
      lifecycle: input.lifecycle === "queued" ? "queued" : "active",
      audio: { type: "speech-synthesis", language: "fr-FR" },
      sourceCaptureId: captureId,
      sourceType: input.sourceType || (captureId ? "capture" : "manual"),
      createdAt: timestamp,
      updatedAt: timestamp,
      lastReviewedAt: ""
    });
    current.cards.push(card);
    if (captureId) {
      current.processedCaptures[captureId] = timestamp;
      current.drafts = current.drafts.filter((draft) => draft.id !== captureId);
    }
    return { state: current, card };
  }

  function updateCard(state, cardId, changes = {}, options = {}) {
    const current = normalizeState(state);
    const index = current.cards.findIndex((card) => card.id === cardId && !card.deletedAt);
    if (index < 0) throw new Error("Sentence not found.");
    const card = current.cards[index];
    const deckId = changes.deckId === undefined ? card.deckId : changes.deckId;
    if (!activeDecks(current).some((deck) => deck.id === deckId)) throw new Error("Choose a deck.");
    current.cards[index] = normalizeCard({
      ...card,
      deckId,
      french: changes.french === undefined ? card.french : validateSentence(changes.french, "Enter the French sentence."),
      english: changes.english === undefined ? card.english : validateSentence(changes.english, "Confirm the English meaning."),
      note: changes.note === undefined ? card.note : String(changes.note || "").trim(),
      updatedAt: getTimestamp(options.now)
    });
    return { state: current, card: current.cards[index] };
  }

  function deleteCard(state, cardId, options = {}) {
    const current = normalizeState(state);
    const index = current.cards.findIndex((card) => card.id === cardId && !card.deletedAt);
    if (index < 0) throw new Error("Sentence not found.");
    const timestamp = getTimestamp(options.now);
    current.cards[index] = { ...current.cards[index], deletedAt: timestamp, updatedAt: timestamp };
    return current;
  }

  function rateCard(state, cardId, rating, options = {}) {
    if (!["missed", "neutral", "understood"].includes(rating)) throw new Error("Rating is invalid.");
    const current = normalizeState(state);
    const index = current.cards.findIndex((card) => card.id === cardId && !card.deletedAt);
    if (index < 0) throw new Error("Sentence not found.");
    const card = current.cards[index];
    const nextScore = rating === "missed"
      ? Math.max(minimumMasteryScore, card.masteryScore / 2)
      : rating === "understood"
        ? card.masteryScore * 2
        : card.masteryScore;
    const timestamp = getTimestamp(options.now);
    current.cards[index] = normalizeCard({
      ...card,
      masteryScore: nextScore,
      lifecycle: rating === "missed" && options.reviewingKnown ? "active" : card.lifecycle,
      lastRating: rating,
      lastReviewedAt: timestamp,
      reviewCount: card.reviewCount + 1,
      updatedAt: timestamp
    });
    return { state: current, card: current.cards[index] };
  }

  function setKnown(state, cardId, known, options = {}) {
    const current = normalizeState(state);
    const index = current.cards.findIndex((card) => card.id === cardId && !card.deletedAt);
    if (index < 0) throw new Error("Sentence not found.");
    current.cards[index] = normalizeCard({
      ...current.cards[index],
      lifecycle: known ? "known" : "active",
      updatedAt: getTimestamp(options.now)
    });
    return { state: current, card: current.cards[index] };
  }

  function setCardLifecycle(state, cardId, lifecycle, options = {}) {
    if (!["active", "known", "queued"].includes(lifecycle)) throw new Error("Sentence lifecycle is invalid.");
    const current = normalizeState(state);
    const index = current.cards.findIndex((card) => card.id === cardId && !card.deletedAt);
    if (index < 0) throw new Error("Sentence not found.");
    current.cards[index] = normalizeCard({
      ...current.cards[index],
      lifecycle,
      updatedAt: getTimestamp(options.now)
    });
    return { state: current, card: current.cards[index] };
  }

  function getReviewQueue(state, options = {}) {
    const current = normalizeState(state);
    const lifecycle = options.knownOnly ? "known" : "active";
    const deckId = options.deckId || "all";
    const random = options.random || Math.random;
    return activeCards(current)
      .filter((card) => card.lifecycle === lifecycle && (deckId === "all" || card.deckId === deckId))
      .map((card) => ({ card, tie: random() }))
      .sort((left, right) => left.card.masteryScore - right.card.masteryScore || left.tie - right.tie)
      .map((entry) => entry.card);
  }

  function getDeckStats(state, deckId) {
    const cards = activeCards(normalizeState(state)).filter((card) => card.deckId === deckId);
    const active = cards.filter((card) => card.lifecycle === "active");
    return {
      total: cards.length,
      active: active.length,
      known: cards.filter((card) => card.lifecycle === "known").length,
      queued: cards.filter((card) => card.lifecycle === "queued").length,
      eligible: active.filter((card) => card.masteryScore >= getDeckThreshold(state, deckId)).length
    };
  }

  function parseBulkText(value) {
    const seen = new Set();
    const rows = [];
    const errors = [];
    String(value || "").split(/\r?\n/).forEach((raw, index) => {
      if (!raw.trim()) return;
      const [frenchPart, ...englishParts] = raw.split("\t");
      const french = String(frenchPart || "").trim();
      const english = englishParts.join("\t").trim();
      if (!french) {
        errors.push({ line: index + 1, message: "French sentence is empty." });
        return;
      }
      if (french.length > maximumSentenceLength || english.length > maximumSentenceLength) {
        errors.push({ line: index + 1, message: "Sentence is too long." });
        return;
      }
      const key = french.toLocaleLowerCase();
      if (seen.has(key)) {
        errors.push({ line: index + 1, message: "Duplicate in this import." });
        return;
      }
      seen.add(key);
      rows.push({ french, english, line: index + 1 });
    });
    return { rows, errors };
  }

  function activeDecks(state) {
    return normalizeState(state).decks.filter((deck) => !deck.deletedAt && !deck.archived)
      .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name));
  }

  function activeCards(state) {
    return normalizeState(state).cards.filter((card) => !card.deletedAt);
  }

  function isCaptureProcessed(state, captureId) {
    return Boolean(normalizeState(state).processedCaptures[String(captureId || "")]);
  }

  function getDeckThreshold(state, deckId) {
    return activeDecks(state).find((deck) => deck.id === deckId)?.knownThreshold || defaultKnownThreshold;
  }

  function normalizeEntities(values, normalizer) {
    if (!Array.isArray(values)) return [];
    const byId = new Map();
    values.forEach((value) => {
      const normalized = normalizer(value);
      if (!normalized?.id) return;
      const existing = byId.get(normalized.id);
      if (!existing || getTime(normalized.updatedAt) >= getTime(existing.updatedAt)) byId.set(normalized.id, normalized);
    });
    return Array.from(byId.values());
  }

  function mergeEntities(cloud, local) {
    return normalizeEntities([...cloud, ...local], (value) => ({ ...value }));
  }

  function normalizeDeck(value = {}) {
    const id = String(value.id || "").trim();
    if (!id) return null;
    return {
      id,
      name: String(value.name || "Untitled deck").trim() || "Untitled deck",
      knownThreshold: normalizeThreshold(value.knownThreshold),
      order: Math.max(0, Number(value.order) || 0),
      archived: Boolean(value.archived),
      createdAt: normalizeTimestamp(value.createdAt),
      updatedAt: normalizeTimestamp(value.updatedAt || value.createdAt),
      deletedAt: normalizeTimestamp(value.deletedAt)
    };
  }

  function normalizeCard(value = {}) {
    const id = String(value.id || "").trim();
    if (!id) return null;
    return {
      id,
      deckId: String(value.deckId || ""),
      french: String(value.french || "").trim(),
      english: String(value.english || "").trim(),
      note: String(value.note || "").trim(),
      masteryScore: normalizeMasteryScore(value.masteryScore),
      lifecycle: ["active", "known", "queued"].includes(value.lifecycle) ? value.lifecycle : "active",
      audio: value.audio && typeof value.audio === "object"
        ? { type: String(value.audio.type || "speech-synthesis"), language: String(value.audio.language || "fr-FR"), reference: String(value.audio.reference || "") }
        : { type: "speech-synthesis", language: "fr-FR", reference: "" },
      sourceCaptureId: String(value.sourceCaptureId || ""),
      sourceType: String(value.sourceType || "manual"),
      reviewCount: Math.max(0, Number(value.reviewCount) || 0),
      lastRating: ["missed", "neutral", "understood"].includes(value.lastRating) ? value.lastRating : "",
      lastReviewedAt: normalizeTimestamp(value.lastReviewedAt),
      createdAt: normalizeTimestamp(value.createdAt),
      updatedAt: normalizeTimestamp(value.updatedAt || value.createdAt),
      deletedAt: normalizeTimestamp(value.deletedAt)
    };
  }

  function normalizeDraft(value = {}) {
    const id = String(value.id || "").trim();
    if (!id) return null;
    return {
      id,
      english: String(value.english || "").trim(),
      note: String(value.note || "").trim(),
      sourceType: String(value.sourceType || "capture"),
      updatedAt: normalizeTimestamp(value.updatedAt)
    };
  }

  function normalizeProcessedCaptures(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.entries(value).reduce((result, [key, timestamp]) => {
      if (key) result[key] = normalizeTimestamp(timestamp) || new Date(0).toISOString();
      return result;
    }, {});
  }

  function mergeProcessedCaptures(cloud, local) {
    return Array.from(new Set([...Object.keys(cloud), ...Object.keys(local)])).reduce((result, key) => {
      result[key] = getTime(local[key]) >= getTime(cloud[key]) ? local[key] : cloud[key];
      return result;
    }, {});
  }

  function normalizeThreshold(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 1 ? Math.min(1024, number) : defaultKnownThreshold;
  }

  function normalizeMasteryScore(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.max(minimumMasteryScore, Math.min(1_048_576, number)) : 1;
  }

  function validateSentence(value, message) {
    const text = String(value || "").trim();
    if (!text) throw new Error(message);
    if (text.length > maximumSentenceLength) throw new Error(`Sentences can be at most ${maximumSentenceLength} characters.`);
    return text;
  }

  function normalizeTimestamp(value) {
    return typeof value === "string" && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : "";
  }

  function getTimestamp(now) {
    const value = typeof now === "function" ? now() : (now || Date.now());
    return new Date(value).toISOString();
  }

  function getTime(value) {
    return Date.parse(value || "") || 0;
  }

  function createId(prefix) {
    return `${prefix}-${Date.now()}-${root.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`;
  }

  root.OghamSentenceCore = {
    defaultKnownThreshold,
    minimumMasteryScore,
    maximumSentenceLength,
    emptyState,
    normalizeState,
    mergeStates,
    createDeck,
    updateDeck,
    deleteDeck,
    saveDraft,
    createCard,
    updateCard,
    deleteCard,
    rateCard,
    setKnown,
    setCardLifecycle,
    getReviewQueue,
    getDeckStats,
    parseBulkText,
    activeDecks,
    activeCards,
    isCaptureProcessed,
    getDeckThreshold
  };
})(window);
