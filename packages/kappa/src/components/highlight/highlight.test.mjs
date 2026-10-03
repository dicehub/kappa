import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  HIGHLIGHT_DEFAULT_EXACT_MATCH,
  HIGHLIGHT_DEFAULT_IGNORE_CASE,
  resolveHighlightMatchAll,
} from "./highlight.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Highlight.vue");
const contracts = source("highlight.ts");
const styles = source("highlight.css");
const barrel = source("index.ts");
const componentBarrel = source("../index.ts");
const packageJson = JSON.parse(source("../../../package.json"));

test("keeps Ark's query-dependent matchAll default", () => {
  assert.equal(HIGHLIGHT_DEFAULT_IGNORE_CASE, false);
  assert.equal(HIGHLIGHT_DEFAULT_EXACT_MATCH, false);
  assert.equal(resolveHighlightMatchAll("solver"), false);
  assert.equal(resolveHighlightMatchAll(["solver", "mesh"]), true);
  assert.equal(resolveHighlightMatchAll(["solver", "mesh"], false), false);
  assert.equal(resolveHighlightMatchAll("solver", true), true);
});

test("wraps Ark Highlight in an inline Kappa root and forwards query props", () => {
  assert.match(component, /Highlight as ArkHighlight/);
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /<span/);
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /class="kappa-highlight"/);
  assert.match(component, /data-slot="highlight"/);
  for (const prop of ["text", "query", "ignoreCase", "matchAll", "exactMatch"]) {
    assert.match(component, new RegExp(`props\\.${prop}`));
  }
  assert.match(component, /:match-all="resolvedMatchAll"/);
  assert.match(component, /matchAll: undefined/);
});

test("documents explicit public contracts and Ark types", () => {
  for (const prop of ["text", "query", "ignoreCase", "matchAll", "exactMatch"]) {
    assert.match(contracts, new RegExp(`${prop}\\??:`));
  }
  assert.match(contracts, /HighlightQuery/);
  assert.match(contracts, /UseHighlightProps/);
  for (const exportName of [
    "Highlight",
    "useHighlight",
    "HighlightChunk",
    "HighlightProps",
    "HighlightQuery",
    "UseHighlightProps",
    "resolveHighlightMatchAll",
  ]) {
    assert.match(barrel, new RegExp(exportName));
  }
  assert.match(componentBarrel, /export \* from "\.\/highlight"/);
  assert.equal(packageJson.exports["./components/*"]["kappa-source"], "./src/components/*/index.ts");
  assert.equal(packageJson.exports["./components/*"].import, "./dist/components/*.js");
});

test("uses semantic Kappa mark styling with high-contrast fallback", () => {
  assert.match(styles, /\.kappa-highlight/);
  assert.match(styles, /:where\(mark\)/);
  assert.match(styles, /--kappa-highlight-background/);
  assert.match(styles, /--kappa-focus-soft/);
  assert.match(styles, /box-decoration-break: clone/);
  assert.match(styles, /text-decoration-line: underline/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /background-color: Highlight/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
