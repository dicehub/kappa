import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const markdownPath = join(import.meta.dirname, "../../dist/docs/components/text.md");

test("emits the complete Text documentation", () => {
  assert.equal(existsSync(markdownPath), true);

  const markdown = readFileSync(markdownPath, "utf8");

  assert.match(markdown, /^# Text\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/text/);
  assert.match(markdown, /```vue\n<script setup>/);
  assert.match(markdown, /```javascript\nimport \{/);
  assert.equal((markdown.match(/```vue/g) ?? []).length, 10);
  assert.equal((markdown.match(/<script setup>/g) ?? []).length, 10);
  assert.match(markdown, /^## \[Composition\]\(#composition\)$/m);
  assert.match(markdown, /^### \[Overview\]\(#overview\)$/m);
  assert.match(markdown, /^### \[Semantic HTML\]\(#semantic-html\)$/m);
  assert.match(markdown, /^### \[Inline Text\]\(#inline-text\)$/m);
  assert.match(markdown, /^### \[Monospace\]\(#monospace\)$/m);
  assert.match(markdown, /^### \[Truncate\]\(#truncate\)$/m);
  assert.match(markdown, /^## \[Accessibility\]\(#accessibility\)$/m);
  assert.match(markdown, /TextProps \/ TextSlots/);
  assert.match(markdown, /KAPPA_TEXT_VARIANTS \/ KAPPA_TEXT_STYLING/);
  assert.doesNotMatch(
    markdown,
    /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
  );
});
