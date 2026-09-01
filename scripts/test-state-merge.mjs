import { readFileSync } from "node:fs";
import vm from "node:vm";
import { webcrypto } from "node:crypto";

const storage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear()
  };
};
const element = {
  innerHTML: "",
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  appendChild: () => {}
};
const context = vm.createContext({
  console,
  URL,
  Date,
  Math,
  JSON,
  Object,
  Array,
  Number,
  String,
  Boolean,
  RegExp,
  Map,
  Set,
  TextEncoder,
  Uint8Array,
  crypto: webcrypto,
  atob: (value) => Buffer.from(value, "base64").toString("binary"),
  btoa: (value) => Buffer.from(value, "binary").toString("base64"),
  document: { querySelector: () => element, addEventListener: () => {}, visibilityState: "visible" },
  window: {
    location: { hostname: "localhost", origin: "http://localhost:8000", hash: "", pathname: "/" },
    localStorage: storage(),
    sessionStorage: storage(),
    history: { replaceState: () => {} },
    addEventListener: () => {},
    clearTimeout,
    setTimeout
  },
  fetch: async () => { throw new Error("Network is disabled in state merge tests."); }
});

const captureSource = readFileSync(new URL("../capture-core.js", import.meta.url), "utf8");
vm.runInContext(captureSource, context, { filename: "capture-core.js" });
const source = readFileSync(new URL("../app.js", import.meta.url), "utf8").replace(/initializeApp\(\);\s*$/, "");
vm.runInContext(source, context, { filename: "app.js" });

testMerge("newer cloud wins", 5, 200, 0, 100, 5);
testMerge("newer local wins", 5, 200, 0, 300, 0);
testMerge("legacy conflict prefers cloud", 5, 0, 0, 0, 5);

console.log("Fluency cross-device merge tests passed.");

function testMerge(label, cloudRating, cloudTime, localRating, localTime, expected) {
  const cloud = createState(cloudRating, cloudTime);
  const local = createState(localRating, localTime);
  context.cloudFixture = cloud;
  context.localFixture = local;
  const merged = vm.runInContext("mergeCloudStateWithLocalState(cloudFixture, localFixture)", context);
  const actual = merged.fluencyRatings["lesson-1"][0];
  const ratingEntries = merged.progress.completed.filter((entry) => entry.startsWith("fluency-rating|lesson-1|0|"));

  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
  if (ratingEntries.length !== 1) {
    throw new Error(`${label}: expected one canonical compatibility rating, received ${ratingEntries.length}`);
  }
}

function createState(rating, updatedAt) {
  return {
    progress: { completed: [`fluency-rating|lesson-1|0|${rating}|${updatedAt}`] },
    fluencyRatings: { "lesson-1": { 0: rating } },
    fluencyRatingUpdatedAt: { "lesson-1": { 0: updatedAt } },
    fluencyReveals: {},
    dictionaryEntries: { entries: [] }
  };
}
