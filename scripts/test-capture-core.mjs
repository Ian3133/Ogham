import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../capture-core.js", import.meta.url), "utf8");
const window = {};
vm.runInNewContext(source, { window, crypto: { randomUUID: () => "generated-id" }, Date, JSON, Error, String });

const values = new Map();
const storage = {
  getItem: (key) => values.has(key) ? values.get(key) : null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: (key) => values.delete(key)
};
const savedRequests = [];
const remote = {
  create: async (capture) => {
    savedRequests.push(capture);
    return { ...capture, createdAt: "2026-09-01T12:00:01.000Z", updatedAt: "2026-09-01T12:00:01.000Z" };
  }
};
const captures = window.OghamCaptureCore.createCaptureModule({
  storage,
  remote,
  now: () => Date.parse("2026-09-01T12:00:00.000Z"),
  createId: () => "capture-1"
});

const result = await captures.create("Bonjour");

assert.equal(result.status, "saved");
assert.equal(result.text, "Bonjour");
assert.equal(savedRequests.length, 1);
assert.deepEqual(JSON.parse(JSON.stringify(savedRequests[0])), {
  captureId: "capture-1",
  text: "Bonjour",
  capturedAt: "2026-09-01T12:00:00.000Z"
});
assert.deepEqual(JSON.parse(storage.getItem("ogham-capture-outbox") || "[]"), []);

let cloudAvailable = false;
const retryStorage = createStorage();
const retriedIds = [];
const retryCaptures = window.OghamCaptureCore.createCaptureModule({
  storage: retryStorage,
  remote: {
    create: async (capture) => {
      if (!cloudAvailable) {
        throw new Error("offline");
      }
      retriedIds.push(capture.captureId);
      return capture;
    }
  },
  now: () => Date.parse("2026-09-01T13:00:00.000Z"),
  createId: () => "capture-pending"
});

const pendingResult = await retryCaptures.create("Je ne sais pas.");
assert.equal(pendingResult.status, "pending");
assert.equal(JSON.parse(retryStorage.getItem("ogham-capture-outbox")).length, 1);

cloudAvailable = true;
const flushResult = await retryCaptures.flushPending();
assert.deepEqual(JSON.parse(JSON.stringify(flushResult)), { saved: 1, pending: 0 });
assert.deepEqual(retriedIds, ["capture-pending"]);
assert.deepEqual(JSON.parse(retryStorage.getItem("ogham-capture-outbox")), []);

const listStorage = createStorage();
listStorage.setItem("ogham-capture-outbox", JSON.stringify([
  { captureId: "pending-2", text: "Encore", capturedAt: "2026-09-01T15:00:00.000Z" },
  { captureId: "saved-1", text: "Retry copy", capturedAt: "2026-09-01T14:00:00.000Z" }
]));
const listCaptures = window.OghamCaptureCore.createCaptureModule({
  storage: listStorage,
  remote: {
    list: async () => ({
      items: [
        { captureId: "saved-1", text: "Cloud copy", createdAt: "2026-09-01T14:00:01.000Z" },
        { captureId: "saved-0", text: "Earlier", createdAt: "2026-09-01T12:00:00.000Z" }
      ]
    })
  }
});

const listed = await listCaptures.list();
assert.equal(listed.cloudAvailable, true);
assert.deepEqual(JSON.parse(JSON.stringify(listed.items.map((item) => [item.captureId, item.status]))), [
  ["pending-2", "pending"],
  ["saved-1", "saved"],
  ["saved-0", "saved"]
]);

const updateStorage = createStorage();
updateStorage.setItem("ogham-capture-outbox", JSON.stringify([
  { captureId: "pending-edit", text: "Bonjor", capturedAt: "2026-09-01T16:00:00.000Z" }
]));
const remoteUpdates = [];
const updateCaptures = window.OghamCaptureCore.createCaptureModule({
  storage: updateStorage,
  remote: {
    update: async (captureId, text) => {
      remoteUpdates.push([captureId, text]);
      return { captureId, text, updatedAt: "2026-09-01T16:30:00.000Z" };
    }
  }
});

const pendingEdit = await updateCaptures.update("pending-edit", "Bonjour");
assert.equal(pendingEdit.status, "pending");
assert.equal(JSON.parse(updateStorage.getItem("ogham-capture-outbox"))[0].text, "Bonjour");

const savedEdit = await updateCaptures.update("saved-edit", "Ça va ?");
assert.equal(savedEdit.status, "saved");
assert.deepEqual(remoteUpdates, [["saved-edit", "Ça va ?"]]);

const deletedIds = [];
const deleteStorage = createStorage();
deleteStorage.setItem("ogham-capture-outbox", JSON.stringify([
  { captureId: "pending-delete", text: "Remove me", capturedAt: "2026-09-01T17:00:00.000Z" }
]));
const deleteCaptures = window.OghamCaptureCore.createCaptureModule({
  storage: deleteStorage,
  remote: { delete: async (captureId) => deletedIds.push(captureId) }
});

await deleteCaptures.delete("pending-delete");
assert.deepEqual(JSON.parse(deleteStorage.getItem("ogham-capture-outbox")), []);
await deleteCaptures.delete("saved-delete");
assert.deepEqual(deletedIds, ["saved-delete"]);

console.log("Capture core create, retry, list, update, and delete tests passed.");

function createStorage() {
  const stored = new Map();
  return {
    getItem: (key) => stored.has(key) ? stored.get(key) : null,
    setItem: (key, value) => stored.set(key, String(value)),
    removeItem: (key) => stored.delete(key)
  };
}
