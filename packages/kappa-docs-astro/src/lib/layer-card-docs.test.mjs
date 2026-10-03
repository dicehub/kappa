import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const markdownPath = join(import.meta.dirname, "../../dist/docs/components/layer-card.md");

test("emits the complete Layer Card documentation", () => {
  assert.equal(existsSync(markdownPath), true);

  const markdown = readFileSync(markdownPath, "utf8");

  assert.match(markdown, /^# Layer Card\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/layer-card/);
  assert.match(markdown, /```vue\n<script setup>/);
  assert.match(markdown, /```javascript\nimport \{/);
  assert.equal((markdown.match(/```vue/g) ?? []).length, 7);
  assert.match(markdown, /^## \[Composition\]\(#composition\)$/m);
  assert.match(markdown, /^### \[Layered Content\]\(#layered-content\)$/m);
  assert.match(markdown, /^### \[Simple Surface\]\(#simple-surface\)$/m);
  assert.match(markdown, /^### \[Interactive Primary Link\]\(#interactive-primary\)$/m);
  assert.match(markdown, /^### \[Layered States\]\(#layered-states\)$/m);
  assert.match(
    markdown,
    /^### \[Filter Toolbar with Small Tabs\]\(#filter-toolbar-with-small-tabs\)$/m,
  );
  assert.match(markdown, /^## \[Accessibility\]\(#accessibility\)$/m);
  assert.match(markdown, /LayerCard\.Primary/);
  assert.match(markdown, /resolveLayerCard\*/);
  assert.doesNotMatch(
    markdown,
    /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
  );
});
