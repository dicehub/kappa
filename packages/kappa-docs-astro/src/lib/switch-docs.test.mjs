import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const markdownPath = join(import.meta.dirname, "../../dist/docs/components/switch.md");

test("emits the complete Switch documentation", () => {
  assert.equal(existsSync(markdownPath), true);

  const markdown = readFileSync(markdownPath, "utf8");

  assert.match(markdown, /^# Switch\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/switch/);
  assert.match(markdown, /```vue\n<script setup>/);
  assert.match(markdown, /```javascript\nimport \{/);
  assert.equal((markdown.match(/```vue/g) ?? []).length, 11);
  assert.equal((markdown.match(/<script setup>/g) ?? []).length, 11);
  assert.match(markdown, /^## \[Composition\]\(#composition\)$/m);
  assert.match(markdown, /^### \[Choice Card\]\(#choice-card\)$/m);
  assert.match(markdown, /^### \[State from Context\]\(#context\)$/m);
  assert.match(markdown, /^### \[Native Form\]\(#native-form\)$/m);
  assert.match(markdown, /^## \[Keyboard Support\]\(#keyboard-support\)$/m);
  assert.match(markdown, /^## \[Accessibility\]\(#accessibility\)$/m);
  assert.match(markdown, /SwitchRootProvider/);
  assert.match(markdown, /SWITCH_SIZES \/ SWITCH_DEFAULT_SIZE/);
  assert.match(markdown, /switchAnatomy \/ useSwitch \/ useSwitchContext/);
  assert.match(markdown, /import \{ Field \}/);
  assert.match(markdown, /import \{ Button \}/);
  assert.doesNotMatch(
    markdown,
    /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
  );
});
