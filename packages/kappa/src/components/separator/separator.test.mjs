import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  SEPARATOR_DEFAULT_ORIENTATION,
  SEPARATOR_ORIENTATIONS,
  isSeparatorOrientation,
  resolveSeparatorOrientation,
} from "./separator.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Separator.vue");
const styles = source("separator.css");
const barrel = source("index.ts");

test("defines horizontal and vertical orientations with a safe default", () => {
  assert.deepEqual(SEPARATOR_ORIENTATIONS, ["horizontal", "vertical"]);
  assert.equal(SEPARATOR_DEFAULT_ORIENTATION, "horizontal");
  assert.equal(isSeparatorOrientation("horizontal"), true);
  assert.equal(isSeparatorOrientation("vertical"), true);

  for (const invalid of ["diagonal", "", null, 1, "constructor"]) {
    assert.equal(isSeparatorOrientation(invalid), false);
    assert.equal(resolveSeparatorOrientation(invalid), "horizontal");
  }
});

test("renders a native line with explicit decorative and semantic contracts", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /<hr/);
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /class="kappa-separator"/);
  assert.match(component, /data-slot="separator"/);
  assert.match(component, /:data-orientation="resolvedOrientation"/);
  assert.match(component, /props\.decorative \? 'none' : 'separator'/);
  assert.match(component, /props\.decorative \? 'true' : undefined/);
  assert.match(component, /props\.decorative \? undefined : resolvedOrientation/);
  assert.doesNotMatch(component, /@ark-ui|@zag-js/);
});

test("uses logical one-pixel geometry and Kappa semantic tokens", () => {
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /\[data-orientation="horizontal"\]/);
  assert.match(styles, /inline-size: 100%/);
  assert.match(styles, /block-size: 1px/);
  assert.match(styles, /\[data-orientation="vertical"\]/);
  assert.match(styles, /inline-size: 1px/);
  assert.match(styles, /align-self: stretch/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.separator\s/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the component and public orientation contract", () => {
  for (const name of [
    "Separator",
    "SeparatorOrientation",
    "SeparatorProps",
    "SEPARATOR_DEFAULT_ORIENTATION",
    "SEPARATOR_ORIENTATIONS",
    "isSeparatorOrientation",
    "resolveSeparatorOrientation",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
