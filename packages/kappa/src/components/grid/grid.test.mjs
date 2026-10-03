import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  GRID_DEFAULT_GAP,
  GRID_GAPS,
  GRID_ITEM_DEFAULT_ELEMENT,
  GRID_ITEM_ELEMENTS,
  GRID_ROOT_DEFAULT_ELEMENT,
  GRID_ROOT_ELEMENTS,
  GRID_VARIANTS,
  isGridGap,
  isGridItemElement,
  isGridRootElement,
  isGridVariant,
  resolveGridGap,
  resolveGridItemElement,
  resolveGridRootElement,
  resolveGridVariant,
} from "./grid.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const rootSource = source("Grid.vue");
const itemSource = source("GridItem.vue");
const styles = source("grid.css");
const barrel = source("index.ts");

test("defines compatible responsive presets, gaps, and semantic elements", () => {
  assert.deepEqual(Object.keys(GRID_VARIANTS), [
    "2up",
    "side-by-side",
    "2-1",
    "1-2",
    "1-3up",
    "3up",
    "4up",
    "6up",
    "1-2-4up",
  ]);
  assert.deepEqual(Object.keys(GRID_GAPS), ["none", "sm", "base", "lg"]);
  assert.deepEqual(GRID_ROOT_ELEMENTS, ["div", "section", "ul", "ol"]);
  assert.deepEqual(GRID_ITEM_ELEMENTS, ["div", "article", "section", "li"]);
  assert.equal(GRID_DEFAULT_GAP, "base");
  assert.equal(GRID_ROOT_DEFAULT_ELEMENT, "div");
  assert.equal(GRID_ITEM_DEFAULT_ELEMENT, "div");
});

test("guards runtime values without accepting inherited object keys", () => {
  for (const variant of Object.keys(GRID_VARIANTS)) assert.equal(isGridVariant(variant), true);
  for (const gap of Object.keys(GRID_GAPS)) assert.equal(isGridGap(gap), true);
  for (const element of GRID_ROOT_ELEMENTS) assert.equal(isGridRootElement(element), true);
  for (const element of GRID_ITEM_ELEMENTS) assert.equal(isGridItemElement(element), true);

  for (const invalid of ["toString", "constructor", "__proto__", "missing", null, 2]) {
    assert.equal(isGridVariant(invalid), false);
    assert.equal(isGridGap(invalid), false);
  }

  assert.equal(resolveGridVariant("3up"), "3up");
  assert.equal(resolveGridVariant("missing"), undefined);
  assert.equal(resolveGridGap("sm"), "sm");
  assert.equal(resolveGridGap("missing"), "base");
  assert.equal(resolveGridRootElement("ul"), "ul");
  assert.equal(resolveGridRootElement("main"), "div");
  assert.equal(resolveGridItemElement("li"), "li");
  assert.equal(resolveGridItemElement("button"), "div");
});

test("renders an attribute-transparent root and provides resolved state", () => {
  assert.match(rootSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(rootSource, /defineSlots<GridRootSlots>/);
  assert.match(rootSource, /provide\(GRID_CONTEXT/);
  assert.match(rootSource, /:is="resolvedElement"/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="grid"/);
  assert.match(rootSource, /:data-gap="resolvedGap"/);
  assert.match(rootSource, /:data-variant="resolvedVariant"/);
});

test("renders semantic grid items and consumes mobile-divider context", () => {
  assert.match(itemSource, /inject\(GRID_CONTEXT/);
  assert.match(itemSource, /resolveGridItemElement\(props\.as\)/);
  assert.match(itemSource, /grid\.variant\.value === "4up"/);
  assert.match(itemSource, /class="kappa-grid__item"/);
  assert.match(itemSource, /data-slot="grid-item"/);
  assert.match(itemSource, /v-bind="\$attrs"/);
});

test("styles every responsive preset with logical sizing and Kappa tokens", () => {
  for (const className of [
    "2up",
    "side-by-side",
    "2-1",
    "1-2",
    "1-3up",
    "3up",
    "4up",
    "6up",
    "1-2-4up",
  ]) {
    assert.match(styles, new RegExp(`\\.kappa-grid--${className.replaceAll("-", "\\-")}`));
  }
  assert.match(styles, /display: grid/);
  assert.match(styles, /min-inline-size: 0/);
  assert.match(styles, /var\(--kappa-grid-gap\)/);
  assert.match(styles, /var\(--kappa-line,/);
  assert.match(styles, /border-block-end/);
  assert.match(styles, /@media \(min-width: 48rem\)/);
  assert.match(styles, /@media \(min-width: 64rem\)/);
  assert.match(styles, /@media \(min-width: 80rem\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /animation|transition/);
});

test("exports named, compound, and public contract surfaces", () => {
  assert.match(barrel, /export const Grid = Object\.assign/);
  assert.match(barrel, /Root: GridRoot/);
  assert.match(barrel, /Item: GridItem/);
  for (const name of [
    "GridRoot",
    "GridItem",
    "GridRootProps",
    "GridItemProps",
    "GridVariant",
    "GridGap",
    "GRID_VARIANTS",
    "GRID_GAPS",
    "resolveGridVariant",
    "resolveGridGap",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
