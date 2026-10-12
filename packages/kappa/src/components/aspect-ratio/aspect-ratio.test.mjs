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
