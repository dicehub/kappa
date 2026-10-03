import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const markdownPath = join(
  import.meta.dirname,
  "../../dist/docs/components/skeleton-line.md",
);

test("emits the complete Skeleton Line documentation", () => {
  assert.equal(existsSync(markdownPath), true);

  const markdown = readFileSync(markdownPath, "utf8");

  assert.match(markdown, /^# Skeleton Line\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/skeleton-line/);
  assert.match(markdown, /```vue\n<script setup>/);
  assert.match(markdown, /```javascript\nimport \{/);
  assert.equal((markdown.match(/```vue/g) ?? []).length, 8);
  assert.match(markdown, /^## \[Examples\]\(#examples\)$/m);
  assert.match(markdown, /^### \[Exact Widths\]\(#widths\)$/m);
  assert.match(markdown, /^### \[Block Height\]\(#block-height\)$/m);
  assert.match(markdown, /^## \[Accessibility\]\(#accessibility\)$/m);
  assert.match(markdown, /SkeletonLineProps/);
  assert.match(markdown, /resolveSkeletonLineLength/);
  assert.doesNotMatch(
    markdown,
    /Planned documentation|Copy page|View Code|On this page|astro-code|--shiki-/,
  );
});
