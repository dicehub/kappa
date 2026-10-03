import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { isolatedViteCache } from "./astro-vite-cache.ts";

test("Astro commands cannot replace the live dev dependency cache", () => {
  const root = new URL("file:///tmp/kappa-docs/");
  const paths = new Map();
  for (const command of ["dev", "sync", "build", "preview", "dev"]) {
    let update;
    isolatedViteCache().hooks["astro:config:setup"]({
      command,
      config: { root },
      updateConfig: (value) => { update = value; },
    });
    const expected = fileURLToPath(new URL(`node_modules/.vite/kappa-${command}/`, root));
    assert.equal(update.vite.cacheDir, expected);
    if (paths.has(command)) assert.equal(update.vite.cacheDir, paths.get(command));
    paths.set(command, update.vite.cacheDir);
  }
  assert.equal(new Set(paths.values()).size, 4);
});
