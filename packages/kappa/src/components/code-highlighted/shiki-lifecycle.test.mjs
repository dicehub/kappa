import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getLanguageSetKey,
  normalizeCodeHighlightedLanguage,
  normalizeLanguageSet,
} from "./code-highlighted.ts";
import { startShikiInitialization } from "./shiki-lifecycle.ts";

const nextTurn = () => new Promise((resolve) => setImmediate(resolve));

test("normalizeCodeHighlightedLanguage resolves aliases and rejects unknown languages", () => {
  assert.equal(normalizeCodeHighlightedLanguage("ts"), "typescript");
  assert.equal(normalizeCodeHighlightedLanguage("sh"), "bash");
  assert.equal(normalizeCodeHighlightedLanguage("py"), "python");
  assert.equal(normalizeCodeHighlightedLanguage("vue"), "vue");
  assert.equal(normalizeCodeHighlightedLanguage("cobol"), null);
});

test("normalizeLanguageSet dedupes, sorts, and drops unknown languages", () => {
  assert.deepEqual(
    normalizeLanguageSet(["ts", "bash", "typescript", "unknown", "sh"], normalizeCodeHighlightedLanguage),
    ["bash", "typescript"],
  );
  assert.equal(getLanguageSetKey(["ts", "sh"], normalizeCodeHighlightedLanguage), "bash,typescript");
});

test("startShikiInitialization disposes a ready highlighter on cleanup", async () => {
  let disposeCount = 0;
  let readyHighlighter;
  const highlighter = {
    dispose() {
      disposeCount += 1;
    },
  };

  const cleanup = startShikiInitialization({
    create: async () => highlighter,
    onError: assert.fail,
    onReady: (ready) => {
      readyHighlighter = ready;
    },
    onSettled() {},
  });

  await nextTurn();
  assert.equal(readyHighlighter, highlighter);

  cleanup();
  cleanup();
  assert.equal(disposeCount, 1);
});

test("startShikiInitialization disposes a highlighter that resolves after cleanup", async () => {
  let disposeCount = 0;
  let resolveHighlighter;
  let ready = false;
  let settled = false;
  const pendingHighlighter = new Promise((resolve) => {
    resolveHighlighter = resolve;
  });
  const highlighter = {
    dispose() {
      disposeCount += 1;
    },
  };

  const cleanup = startShikiInitialization({
    create: () => pendingHighlighter,
    onError: assert.fail,
    onReady: () => {
      ready = true;
    },
    onSettled: () => {
      settled = true;
    },
  });

  cleanup();
  resolveHighlighter(highlighter);
  await nextTurn();

  assert.equal(disposeCount, 1);
  assert.equal(ready, false);
  assert.equal(settled, false);
});

test("startShikiInitialization reports creation errors once", async () => {
  const failure = new Error("boom");
  let errorCount = 0;
  let settled = false;

  startShikiInitialization({
    create: async () => {
      throw failure;
    },
    onError: (error) => {
      errorCount += 1;
      assert.equal(error, failure);
    },
    onReady: assert.fail,
    onSettled: () => {
      settled = true;
    },
  });

  await nextTurn();
  assert.equal(errorCount, 1);
  assert.equal(settled, true);
});
