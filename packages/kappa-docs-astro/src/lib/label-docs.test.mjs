import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const markdownPath = join(import.meta.dirname, "../../dist/docs/components/label.md");

test("emits the complete Label documentation", () => {
  assert.equal(existsSync(markdownPath), true);

  const markdown = readFileSync(markdownPath, "utf8");

  assert.match(markdown, /^# Label\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/label/);
  assert.match(markdown, /```vue\n<script setup>/);
  assert.match(markdown, /```javascript\nimport \{/);
  assert.equal((markdown.match(/```vue/g) ?? []).length, 9);
  assert.match(markdown, /^## \[Composition\]\(#composition\)$/m);
  assert.match(markdown, /^### \[Content Composition\]\(#content-composition\)$/m);
  assert.match(markdown, /^### \[Persistent Guidance\]\(#guidance\)$/m);
  assert.match(markdown, /^## \[Accessibility\]\(#accessibility\)$/m);
  assert.match(markdown, /LabelProps \/ LabelSlots/);
  assert.match(markdown, /resolveLabelOptionalText/);
  assert.doesNotMatch(
    markdown,
    /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
  );
});
