(function attachCaptureCore(root) {
  const outboxKey = "ogham-capture-outbox";
  const maxCaptureLength = 4000;

  function createCaptureModule(options) {
    const storage = options.storage;
    const remote = options.remote;
    const now = options.now || Date.now;
    const createId = options.createId || (() => `${now()}-${crypto.randomUUID()}`);

    async function create(text) {
      validateText(text);
      const capture = {
        captureId: createId(),
        text,
        capturedAt: new Date(now()).toISOString()
      };
      const pending = readOutbox(storage);
      writeOutbox(storage, [capture, ...pending]);

      try {
        const saved = await remote.create(capture);
        writeOutbox(storage, readOutbox(storage).filter((item) => item.captureId !== capture.captureId));
        return { ...saved, status: "saved" };
      } catch (error) {
        return { ...capture, status: "pending", error: error?.message || "Cloud save failed." };
      }
    }

    async function flushPending() {
      const pending = readOutbox(storage);
      const remaining = [];
      let saved = 0;

      for (const capture of pending) {
        try {
          await remote.create(capture);
          saved += 1;
        } catch {
          remaining.push(capture);
        }
      }

      writeOutbox(storage, remaining);
      return { saved, pending: remaining.length };
    }

    async function list() {
      const pending = readOutbox(storage);

      try {
        const result = await remote.list();
        const savedItems = Array.isArray(result) ? result : (result?.items || []);
        const savedIds = new Set(savedItems.map((item) => item.captureId));
        const unresolved = pending.filter((item) => !savedIds.has(item.captureId));

        if (unresolved.length !== pending.length) {
          writeOutbox(storage, unresolved);
        }

        return {
          cloudAvailable: true,
          items: [
            ...unresolved.map((item) => ({ ...item, status: "pending" })),
            ...savedItems.map((item) => ({ ...item, status: "saved" }))
          ].sort((a, b) => getCaptureTime(b) - getCaptureTime(a))
        };
      } catch (error) {
        return {
          cloudAvailable: false,
          error: error?.message || "Cloud load failed.",
          items: pending.map((item) => ({ ...item, status: "pending" }))
        };
      }
    }

    async function update(captureId, text) {
      validateText(text);
      const pending = readOutbox(storage);
      const pendingIndex = pending.findIndex((item) => item.captureId === captureId);

      if (pendingIndex >= 0) {
        pending[pendingIndex] = { ...pending[pendingIndex], text };
        writeOutbox(storage, pending);
        return { ...pending[pendingIndex], status: "pending" };
      }

      const saved = await remote.update(captureId, text);
      return { ...saved, status: "saved" };
    }

    async function remove(captureId) {
      const pending = readOutbox(storage);
      const remaining = pending.filter((item) => item.captureId !== captureId);

      if (remaining.length !== pending.length) {
        writeOutbox(storage, remaining);
        return;
      }

      await remote.delete(captureId);
    }

    return { create, flushPending, list, update, delete: remove };
  }

  function validateText(text) {
    if (typeof text !== "string" || !text.trim()) {
      throw new Error("Enter a word, phrase, or sentence.");
    }
    if (text.length > maxCaptureLength) {
      throw new Error(`Captures can be at most ${maxCaptureLength} characters.`);
    }
  }

  function readOutbox(storage) {
    try {
      const value = JSON.parse(storage.getItem(outboxKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function writeOutbox(storage, items) {
    storage.setItem(outboxKey, JSON.stringify(items));
  }

  function getCaptureTime(capture) {
    return Date.parse(capture.createdAt || capture.capturedAt || "") || 0;
  }

  root.OghamCaptureCore = {
    createCaptureModule,
    maxCaptureLength
  };
})(window);
