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

test("guards variants, sizes, and semantic elements", () => {
  assert.equal(resolveTextVariant("heading"), "heading");
  assert.equal(resolveTextVariant("unknown"), "body");
  assert.equal(resolveTextSize("xs"), "xs");
  assert.equal(resolveTextSize("xl"), "base");
  assert.equal(isTextElement("time"), true);
  for (const invalid of ["script", "button", "constructor", "__proto__", null]) {
    assert.equal(isTextElement(invalid), false);
  }
  assert.equal(isCopyTextVariant("success"), true);
  assert.equal(isMonospaceTextVariant("mono-secondary"), true);
  assert.equal(isHeadingTextVariant("heading3"), true);
  assert.equal(isDeprecatedHeadingTextVariant("heading2"), true);
});

test("keeps visual treatment separate from semantic HTML", () => {
  assert.equal(resolveTextElement(undefined, "body"), "p");
  assert.equal(resolveTextElement(undefined, "heading"), "span");
  assert.equal(resolveTextElement(undefined, "mono"), "span");
  assert.equal(resolveTextElement("h2", "heading"), "h2");
  assert.equal(resolveTextElement("script", "body"), "p");
  assert.equal(resolveTextSizeClass("heading", "base"), undefined);
  assert.equal(resolveTextSizeClass("heading", "lg"), "kappa-text--size-lg");
  assert.equal(resolveTextSizeClass("mono", "base"), "kappa-text--size-sm");
  assert.equal(resolveTextSizeClass("mono", "lg"), "kappa-text--size-base");
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

test("exports the component and public text contracts", () => {
  for (const name of [
    "Text",
    "TextProps",
    "TextSlots",
    "TextVariant",
    "TextSize",
    "TextElement",
    "KAPPA_TEXT_VARIANTS",
    "KAPPA_TEXT_STYLING",
    "textVariants",
    "resolveTextElement",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
