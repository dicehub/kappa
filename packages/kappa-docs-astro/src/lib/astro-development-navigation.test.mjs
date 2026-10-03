import assert from "node:assert/strict";
import { test } from "node:test";
import { developmentNavigation } from "./astro-development-navigation.ts";

test("development navigation disables speculative page requests only in dev", () => {
  const updates = [];
  const hook = developmentNavigation().hooks["astro:config:setup"];

  for (const command of ["dev", "sync", "build", "preview"]) {
    hook({
      command,
      updateConfig: (value) => updates.push({ command, value }),
    });
  }

  assert.deepEqual(updates, [{ command: "dev", value: { prefetch: false } }]);
});
