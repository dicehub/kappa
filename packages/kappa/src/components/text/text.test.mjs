import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  KAPPA_TEXT_DEFAULT_VARIANTS,
  KAPPA_TEXT_STYLING,
  TEXT_DEFAULT_VARIANTS,
  TEXT_DEPRECATED_HEADING_VARIANTS,
  TEXT_ELEMENTS,
  TEXT_SIZES,
  isCopyTextVariant,
  isDeprecatedHeadingTextVariant,
  isHeadingTextVariant,
  isMonospaceTextVariant,
  isTextElement,
  resolveTextElement,
  resolveTextSize,
  resolveTextSizeClass,
  resolveTextVariant,
  textVariants,
} from "./text.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Text.vue");
const styles = source("text.css");
const barrel = source("index.ts");

test("defines the compact Kappa text scale and compatibility variants", () => {
  assert.deepEqual(TEXT_SIZES, ["xs", "sm", "base", "lg"]);
  assert.deepEqual(TEXT_DEPRECATED_HEADING_VARIANTS, ["heading1", "heading2", "heading3"]);
  assert.deepEqual(KAPPA_TEXT_DEFAULT_VARIANTS, TEXT_DEFAULT_VARIANTS);
  assert.equal(KAPPA_TEXT_STYLING.fontSizes.base, 14);
  assert.equal(KAPPA_TEXT_STYLING.fontWeights.semibold, 650);
  assert.equal(KAPPA_TEXT_STYLING.baseColor, "kappa-text--body");
  assert.equal(TEXT_ELEMENTS.includes("figcaption"), true);
});





test("builds deterministic classes with safe fallbacks", () => {
  assert.equal(textVariants(), "kappa-text kappa-text--body kappa-text--size-base");
  assert.equal(textVariants({ variant: "heading" }), "kappa-text kappa-text--heading");
  assert.equal(
    textVariants({ variant: "heading", size: "lg" }),
    "kappa-text kappa-text--heading kappa-text--size-lg",
  );
  assert.equal(
    textVariants({ variant: "invalid", size: "huge" }),
    "kappa-text kappa-text--body kappa-text--size-base",
  );
});

test("renders a guarded native element and forwards consumer attributes", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /defineSlots<TextSlots>/);
  assert.match(component, /:is="renderedElement"/);
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /data-slot="text"/);
  assert.match(component, /:data-variant="resolvedVariant"/);
  assert.match(component, /props\.truncate && "kappa-text--truncate"/);
});

test("uses semantic tokens, compact typography, and one-line truncation", () => {
  assert.match(styles, /font-family: var\(--kappa-font-sans/);
  assert.match(styles, /var\(--kappa-success-text/);
  assert.match(styles, /var\(--kappa-danger-text/);
  assert.match(styles, /font-variant-numeric: tabular-nums/);
  assert.match(styles, /text-overflow: ellipsis/);
  assert.match(styles, /white-space: nowrap/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
