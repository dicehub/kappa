import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  SKELETON_LINE_DEFAULT_HEIGHT,
  SKELETON_LINE_DEFAULT_WIDTH,
  resolveSkeletonLineLength,
} from "./skeleton-line.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("SkeletonLine.vue");
const styles = source("skeleton-line.css");
const barrel = source("index.ts");

test("resolves deterministic CSS lengths with safe fallbacks", () => {
  assert.equal(SKELETON_LINE_DEFAULT_WIDTH, "100%");
  assert.equal(SKELETON_LINE_DEFAULT_HEIGHT, "0.5rem");
  assert.equal(resolveSkeletonLineLength(48, "1rem"), "48px");
  assert.equal(resolveSkeletonLineLength(" 72% ", "100%"), "72%");

  for (const invalid of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, "", "   ", null]) {
    assert.equal(resolveSkeletonLineLength(invalid, "1rem"), "1rem");
  }
});

test("renders a decorative line and forwards attributes to its visible shape", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /v-bind="\$attrs"[\s\S]*aria-hidden="true"/);
  assert.match(component, /class="kappa-skeleton-line"/);
  assert.match(component, /data-slot="skeleton-line"/);
  assert.match(component, /:data-animated="props\.animated"/);
  assert.match(component, /v-if="resolvedBlockHeight"/);
  assert.match(component, /data-slot="skeleton-line-block"/);
  assert.doesNotMatch(component, /Math\.random|useId|@ark-ui|@zag-js/);
});

test("uses exact logical geometry, semantic tokens, and restrained motion", () => {
  assert.match(styles, /--kappa-skeleton-line-width: 100%/);
  assert.match(styles, /--kappa-skeleton-line-height: 0\.5rem/);
  assert.match(styles, /--kappa-skeleton-line-radius: 0\.125rem/);
  assert.match(styles, /inline-size: var\(--kappa-skeleton-line-width\)/);
  assert.match(styles, /block-size: var\(--kappa-skeleton-line-height\)/);
  assert.match(styles, /var\(--kappa-tint/);
  assert.match(styles, /var\(--kappa-default/);
  assert.match(styles, /@keyframes kappa-skeleton-line-scan/);
  assert.match(styles, /\[data-animated="true"\]::after/);
  assert.match(
    styles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.kappa-skeleton-line\[data-animated="true"\]::after/,
  );
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /(?:^|\s)(?:width|height|left|right):/m);
  assert.doesNotMatch(styles, /\.skeleton-line\s/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the component, public props, constants, and resolver", () => {
  for (const name of [
    "SkeletonLine",
    "SkeletonLineLength",
    "SkeletonLineProps",
    "SKELETON_LINE_DEFAULT_HEIGHT",
    "SKELETON_LINE_DEFAULT_WIDTH",
    "resolveSkeletonLineLength",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
