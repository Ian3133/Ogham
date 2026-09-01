import assert from "node:assert/strict";
import { handleCaptureRequest } from "../aws/capture-http.mjs";

const created = [];
const store = {
  create: async (userId, capture) => {
    created.push([userId, capture]);
    return capture;
  }
};
const response = await handleCaptureRequest({
  version: "2.0",
  rawPath: "/captures",
  requestContext: {
    http: { method: "POST", path: "/captures" },
    authorizer: { jwt: { claims: { sub: "user-123" } } }
  },
  body: JSON.stringify({
    captureId: "1725192000000-capture-1",
    text: "Comment allez-vous ?",
    capturedAt: "2026-09-01T12:00:00.000Z"
  })
}, store, { now: () => "2026-09-01T12:00:01.000Z" });

assert.equal(response.statusCode, 201);
assert.deepEqual(created, [["user-123", {
  captureId: "1725192000000-capture-1",
  text: "Comment allez-vous ?",
  capturedAt: "2026-09-01T12:00:00.000Z",
  createdAt: "2026-09-01T12:00:01.000Z",
  updatedAt: "2026-09-01T12:00:01.000Z",
  schemaVersion: 1
}]]);
assert.equal(JSON.parse(response.body).capture.text, "Comment allez-vous ?");

const listCalls = [];
const listResponse = await handleCaptureRequest({
  version: "2.0",
  rawPath: "/captures",
  rawQueryString: "limit=25&cursor=next-page",
  requestContext: {
    http: { method: "GET", path: "/captures" },
    authorizer: { jwt: { claims: { sub: "user-list" } } }
  }
}, {
  list: async (userId, options) => {
    listCalls.push([userId, options]);
    return { items: [{ captureId: "capture-2", text: "Salut" }], nextCursor: "after-2" };
  }
});

assert.equal(listResponse.statusCode, 200);
assert.deepEqual(listCalls, [["user-list", { limit: 25, cursor: "next-page" }]]);
assert.deepEqual(JSON.parse(listResponse.body), {
  items: [{ captureId: "capture-2", text: "Salut" }],
  nextCursor: "after-2"
});

const updateCalls = [];
const updateResponse = await handleCaptureRequest({
  rawPath: "/captures/capture-edit",
  requestContext: {
    http: { method: "PATCH", path: "/captures/capture-edit" },
    authorizer: { jwt: { claims: { sub: "user-edit" } } }
  },
  body: JSON.stringify({ text: "Je comprends." })
}, {
  update: async (userId, captureId, changes) => {
    updateCalls.push([userId, captureId, changes]);
    return { captureId, text: changes.text, updatedAt: changes.updatedAt };
  }
}, { now: () => "2026-09-01T13:00:00.000Z" });

assert.equal(updateResponse.statusCode, 200);
assert.deepEqual(updateCalls, [["user-edit", "capture-edit", {
  text: "Je comprends.",
  updatedAt: "2026-09-01T13:00:00.000Z"
}]]);
assert.equal(JSON.parse(updateResponse.body).capture.text, "Je comprends.");

const deleteCalls = [];
const deleteResponse = await handleCaptureRequest({
  rawPath: "/captures/capture-delete",
  requestContext: {
    http: { method: "DELETE", path: "/captures/capture-delete" },
    authorizer: { jwt: { claims: { sub: "user-delete" } } }
  }
}, {
  delete: async (userId, captureId) => deleteCalls.push([userId, captureId])
});

assert.equal(deleteResponse.statusCode, 204);
assert.equal(deleteResponse.body, "");
assert.deepEqual(deleteCalls, [["user-delete", "capture-delete"]]);

const unauthorizedResponse = await handleCaptureRequest({
  rawPath: "/captures",
  requestContext: { http: { method: "GET", path: "/captures" } }
}, { list: async () => { throw new Error("Store must not be called."); } });
assert.equal(unauthorizedResponse.statusCode, 401);

const blankResponse = await handleCaptureRequest({
  rawPath: "/captures",
  requestContext: {
    http: { method: "POST", path: "/captures" },
    authorizer: { jwt: { claims: { sub: "user-blank" } } }
  },
  body: JSON.stringify({ captureId: "capture-blank", text: "   " })
}, { create: async () => { throw new Error("Store must not be called."); } });
assert.equal(blankResponse.statusCode, 400);

const unavailableResponse = await handleCaptureRequest({
  rawPath: "/captures",
  requestContext: {
    http: { method: "POST", path: "/captures" },
    authorizer: { jwt: { claims: { sub: "user-outage" } } }
  },
  body: JSON.stringify({ captureId: "capture-outage", text: "À revoir" })
}, { create: async () => { throw new Error("DynamoDB unavailable"); } });
assert.equal(unavailableResponse.statusCode, 500);

console.log("Capture HTTP create, list, update, delete, auth, validation, and outage tests passed.");
