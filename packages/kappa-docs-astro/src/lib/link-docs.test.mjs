import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const markdownPath = join(import.meta.dirname, "../../dist/docs/components/link.md");

test("emits the complete Link documentation", () => {
  assert.equal(existsSync(markdownPath), true);

  const markdown = readFileSync(markdownPath, "utf8");

  assert.match(markdown, /^# Link\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/link/);
  assert.match(markdown, /```vue\n<script setup>/);
  assert.match(markdown, /```javascript\nimport \{/);
  assert.equal((markdown.match(/```vue/g) ?? []).length, 9);
  assert.equal((markdown.match(/<script setup>/g) ?? []).length, 9);
  assert.match(markdown, /^## \[Composition\]\(#composition\)$/m);
  assert.match(markdown, /^### \[External Link\]\(#external-link\)$/m);
  assert.match(markdown, /^### \[Inline in Paragraph\]\(#inline-in-paragraph\)$/m);
  assert.match(markdown, /^### \[Router Link\]\(#router-link\)$/m);
  assert.match(markdown, /^### \[Current Page\]\(#current-page\)$/m);
  assert.match(markdown, /^## \[Accessibility\]\(#accessibility\)$/m);
  assert.match(markdown, /LinkProps \/ LinkSlots \/ LinkVariant/);
  assert.match(markdown, /import \{ Link, LinkExternalIcon \}/);
  assert.match(markdown, /resolveLinkTarget \/ resolveLinkRel/);
  assert.doesNotMatch(
    markdown,
    /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
  );
});
