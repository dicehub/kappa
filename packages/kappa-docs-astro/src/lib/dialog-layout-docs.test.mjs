import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const pageSource = readFileSync(
  new URL("../pages/docs/components/dialog-layout.astro", import.meta.url),
  "utf8",
);
const dataSource = readFileSync(new URL("../data/dialog-layout-docs.ts", import.meta.url), "utf8");

test("Dialog Layout documentation covers its public structure", () => {
  assert.match(pageSource, /title="Dialog Layout"/);
  assert.match(pageSource, /CompositionTree component="dialogLayout"/);
  assert.match(pageSource, /Ark UI Dialog/);
  assert.match(dataSource, /DialogLayout\.Actions\.Primary/);
  assert.match(dataSource, /verticalAlign/);
  assert.match(dataSource, /dismissDisabled/);
});

test("Dialog Layout examples use only public package exports", () => {
  assert.match(dataSource, /@dicehub\/kappa\/components\/dialog-layout/);
  assert.doesNotMatch(dataSource, /packages\/kappa\/src|\.\.\/\.\.\/\.\.\/kappa\/src/);
});

test("standalone Vue fragments use a template wrapper for syntax highlighting", () => {
  assert.match(dataSource, /const vueTemplate/);
  assert.equal((dataSource.match(/vueTemplate\(`/g) ?? []).length, 7);
});
