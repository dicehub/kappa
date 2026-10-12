import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const pageSource = readFileSync(
  new URL("../pages/docs/components/dialog-layout.astro", import.meta.url),
  "utf8",
);
const dataSource = readFileSync(new URL("../data/dialog-layout-docs.ts", import.meta.url), "utf8");





test("standalone Vue fragments use a template wrapper for syntax highlighting", () => {
  assert.match(dataSource, /const vueTemplate/);
  assert.equal((dataSource.match(/vueTemplate\(`/g) ?? []).length, 7);
});
