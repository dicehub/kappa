import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  ASPECT_RATIO_DEFAULT_RATIO,
  isAspectRatio,
  resolveAspectRatio,
} from "./aspect-ratio.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("AspectRatio.vue");
const styles = source("aspect-ratio.css");
const barrel = source("index.ts");

test("guards finite positive ratios and falls back to a square", () => {
  assert.equal(ASPECT_RATIO_DEFAULT_RATIO, 1);
  for (const ratio of [1, 16 / 9, 0.5, Number.MIN_VALUE]) {
    assert.equal(isAspectRatio(ratio), true);
    assert.equal(resolveAspectRatio(ratio), ratio);
  }
  for (const invalid of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "16/9", null]) {
    assert.equal(isAspectRatio(invalid), false);
    assert.equal(resolveAspectRatio(invalid), 1);
  }
});

test("renders a native ratio root and forwards consumer attributes", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /defineProps<AspectRatioProps>/);
  assert.match(component, /defineSlots<AspectRatioSlots>/);
  assert.match(component, /<div/);
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /class="kappa-aspect-ratio"/);
  assert.match(component, /data-slot="aspect-ratio"/);
  assert.match(component, /:data-ratio="resolvedRatio"/);
  assert.match(component, /--kappa-aspect-ratio/);
  assert.match(component, /<slot \/>/);
});

test("uses a logical, block-level CSS aspect ratio without a runtime primitive", () => {
  assert.match(styles, /\.kappa-aspect-ratio \{/);
  assert.match(styles, /display: block/);
  assert.match(styles, /min-inline-size: 0/);
  assert.match(styles, /min-block-size: 0/);
  assert.match(styles, /aspect-ratio: var\(--kappa-aspect-ratio, 1\)/);
  assert.doesNotMatch(component, /@ark-ui|@zag-js/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the component and public ratio contracts", () => {
  for (const name of [
    "AspectRatio",
    "AspectRatioProps",
    "AspectRatioSlots",
    "ASPECT_RATIO_DEFAULT_RATIO",
    "isAspectRatio",
    "resolveAspectRatio",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
