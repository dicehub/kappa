import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const markdownPath = join(import.meta.dirname, "../../dist/docs/components/input-area.md");

test("emits the complete Input Area documentation", () => {
  assert.equal(existsSync(markdownPath), true);

  const markdown = readFileSync(markdownPath, "utf8");

  assert.match(markdown, /^# Input Area\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/input-area/);
  assert.match(markdown, /```vue\n<script setup>/);
  assert.match(markdown, /```javascript\nimport \{/);
  assert.equal((markdown.match(/```vue/g) ?? []).length, 10);
  assert.match(markdown, /^## \[Composition\]\(#composition\)$/m);
  assert.match(markdown, /^### \[Auto Resize\]\(#autoresize\)$/m);
  assert.match(markdown, /^### \[Form States\]\(#states\)$/m);
  assert.match(markdown, /^### \[Right to Left\]\(#right-to-left\)$/m);
  assert.match(markdown, /^## \[Accessibility\]\(#accessibility\)$/m);
  assert.match(markdown, /InputAreaProps \/ InputAreaEmits \/ InputAreaSlots/);
  assert.match(markdown, /resolveInputAreaSize/);
  assert.doesNotMatch(
    markdown,
    /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
  );
});
