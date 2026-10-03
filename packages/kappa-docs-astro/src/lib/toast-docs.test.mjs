import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("publishes complete Toast documentation and copy-ready examples", () => {
  const markdown = readFileSync(new URL("../../dist/docs/components/toast.md", import.meta.url), "utf8");
  assert.match(markdown, /^# Toast\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/toast/);
  for (const heading of ["Promise", "Update in Place", "Stack and Queue", "Duration and Pause", "Placement", "Right-to-left", "Custom Composition", "Accessibility", "API Reference"]) {
    assert.ok(markdown.includes(heading), heading);
  }
  assert.match(markdown, /server module singleton/);
  assert.match(markdown, /one host per placement/);
  assert.match(markdown, /Toast\.ActionTrigger/);
  assert.match(markdown, /createToaster/);
  assert.match(markdown, /onStatusChange/);
  assert.equal((markdown.match(/```vue/g) ?? []).length, 11);
  assert.doesNotMatch(markdown, /Planned documentation|Copy page|View Code|On this page|--shiki-/);
});
