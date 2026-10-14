import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { setImmediate } from "node:timers/promises";
import { startShikiInitialization } from "../../../packages/kappa/src/components/code-highlighted/shiki-lifecycle.ts";

// Approved private ownership exception; see docs/TESTING.md#test-exceptions.
const require = createRequire(new URL("../../../packages/kappa/package.json", import.meta.url));
const load = name => import(pathToFileURL(require.resolve(name)));
const { createHighlighterCore } = await load("shiki/core");
const { createJavaScriptRegexEngine } = await load("shiki/engine/javascript");
const { default: theme } = await load("@shikijs/themes/github-light");
const { default: language } = await load("@shikijs/langs/typescript");
const code = "const answer: number = 42;";
const options = { lang: "typescript", theme: "github-light" };
const fresh = () => createHighlighterCore({
  engine: createJavaScriptRegexEngine(), themes: [theme], langs: [language],
});

test("ready ownership cleanup disposes a real usable Shiki resource", async () => {
  const highlighter = await fresh();
  let cleanup;
  try {
    assert.match(highlighter.codeToHtml(code, options), /<span/);
    const state = { ready: false, settled: false };
    cleanup = startShikiInitialization({
      create: async () => highlighter,
      onReady: () => { state.ready = true; },
      onError: assert.fail,
      onSettled: () => { state.settled = true; },
    });
    await setImmediate();
    assert.deepEqual(state, { ready: true, settled: true });
    cleanup();
    assert.throws(() => highlighter.codeToHtml(code, options), /disposed/i);
    assert.doesNotThrow(cleanup);
  } finally { cleanup?.(); highlighter.dispose(); }
});

test("cancelled delivery disposes a real Shiki resource without reviving readiness", async () => {
  const highlighter = await fresh();
  let cleanup, release;
  try {
    assert.match(highlighter.codeToHtml(code, options), /<span/);
    const gate = new Promise(resolve => { release = resolve; });
    const state = { ready: false, settled: false, error: false };
    cleanup = startShikiInitialization({
      create: () => gate.then(() => highlighter),
      onReady: () => { state.ready = true; },
      onError: () => { state.error = true; },
      onSettled: () => { state.settled = true; },
    });
    cleanup();
    release();
    await setImmediate();
    assert.throws(() => highlighter.codeToHtml(code, options), /disposed/i);
    assert.deepEqual(state, { ready: false, settled: false, error: false });
  } finally { release?.(); await setImmediate(); cleanup?.(); highlighter.dispose(); }
});
