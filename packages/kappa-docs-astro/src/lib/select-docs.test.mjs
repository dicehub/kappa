import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const markdownPath = join(import.meta.dirname, "../../dist/docs/components/select.md");

test("Select Markdown contains the public API and examples", () => {
  assert.equal(existsSync(markdownPath), true);
  const markdown = readFileSync(markdownPath, "utf8");

  assert.match(markdown, /^# Select\b/);
  assert.match(markdown, /@dicehub\/kappa\/components\/select/);
  assert.match(markdown, /\x60vue\n<script setup>/);
  assert.match(markdown, /\x60javascript\nimport \{/);
  assert.equal((markdown.match(/\x60vue/g) ?? []).length, 12);
  assert.match(markdown, /^## \[Composition\]\(#composition\)$/m);
  assert.match(markdown, /^### \[Grouped options\]\(#grouped\)$/m);
  assert.match(markdown, /^### \[Multiple values\]\(#multiple\)$/m);
  assert.match(
    markdown,
    /^### \[Aligned to the selected option\]\(#aligned-to-the-selected-option\)$/m,
  );
  assert.match(markdown, /^### \[Placement\]\(#placement\)$/m);
  assert.match(
    markdown,
    /^### \[Long list \(scrolling test\)\]\(#long-list-scrolling-test\)$/m,
  );
  assert.match(markdown, /^### \[Right to left\]\(#rtl\)$/m);
  assert.match(markdown, /^## \[Accessibility\]\(#accessibility\)$/m);
  assert.match(markdown, /SelectProps \/ SelectEmits \/ SelectSlots/);
  assert.match(markdown, /SelectSelectionDetails/);
  assert.doesNotMatch(markdown, /SelectSelectDetails/);
  assert.match(markdown, /createSelectCollection/);
  assert.doesNotMatch(markdown, /View Code|On this page/);
});
