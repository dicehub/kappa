import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  BADGE_DEFAULT_ELEMENT,
  BADGE_DEFAULT_VARIANT,
  BADGE_VARIANTS,
  isBadgeElement,
  isBadgeVariant,
} from "./badge.ts";

const componentSource = readFileSync(new URL("./Badge.vue", import.meta.url), "utf8");
const styles = readFileSync(new URL("./badge.css", import.meta.url), "utf8");
const moduleBarrel = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

test("keeps the public variant contract", () => {
  assert.deepEqual(Object.keys(BADGE_VARIANTS), [
    "primary",
    "secondary",
    "error",
    "warning",
    "success",
    "destructive",
    "info",
    "beta",
    "outline",
    "red",
    "orange",
    "green",
    "teal",
    "teal-subtle",
    "blue",
    "purple",
    "neutral",
  ]);
  assert.equal(BADGE_DEFAULT_VARIANT, "primary");
  assert.equal(BADGE_DEFAULT_ELEMENT, "span");
});

test("validates only own variant keys", () => {
  for (const variant of Object.keys(BADGE_VARIANTS)) {
    assert.equal(isBadgeVariant(variant), true);
  }

  for (const value of ["missing", "toString", "constructor", "__proto__", null, 1]) {
    assert.equal(isBadgeVariant(value), false);
  }
});

test("supports only a label span or semantic link", () => {
  assert.equal(isBadgeElement("span"), true);
  assert.equal(isBadgeElement("a"), true);
  assert.equal(isBadgeElement("button"), false);
  assert.equal(isBadgeElement("div"), false);
  assert.equal(isBadgeElement(null), false);
});

test("renders a configurable native element and forwards consumer attributes", () => {
  assert.match(componentSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(componentSource, /:is="resolvedElement"/);
  assert.match(componentSource, /isBadgeElement\(props\.as\)/);
  assert.match(componentSource, /v-bind="\$attrs"/);
  assert.match(componentSource, /class="kappa-badge"/);
  assert.match(componentSource, /data-slot="badge"/);
  assert.match(componentSource, /:data-variant="resolvedVariant"/);
  assert.match(componentSource, /isBadgeVariant\(props\.variant\)/);
});

test("uses compact pill geometry, logical icon spacing, and semantic tokens", () => {
  assert.match(styles, /block-size: 1\.25rem/);
  assert.match(styles, /border-radius: 999px/);
  assert.match(styles, /font-size: 0\.75rem/);
  assert.match(styles, /line-height: 1rem/);
  assert.match(styles, /padding-inline: 0\.5rem/);
  assert.match(styles, /\[data-icon\]:first-child/);
  assert.match(styles, /padding-inline-start: 0\.375rem/);
  assert.match(styles, /\[data-icon\]:last-child/);
  assert.match(styles, /padding-inline-end: 0\.375rem/);
  assert.match(styles, /pointer-events: none/);
  assert.doesNotMatch(styles, /\[data-icon\]:only-child/);
  assert.doesNotMatch(styles, /text-overflow/);
  assert.match(styles, /var\(--kappa-danger-tint/);
  assert.match(styles, /var\(--kappa-success-text/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("limits interactive states to semantic links and respects reduced motion", () => {
  assert.match(styles, /a\.kappa-badge:hover/);
  assert.match(styles, /text-decoration: underline/);
  assert.match(styles, /a\.kappa-badge:focus-visible/);
  assert.doesNotMatch(styles, /aria-disabled/);
  assert.doesNotMatch(styles, /\n\.kappa-badge:hover/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("exports the component, helpers, props, element, and variant types", () => {
  assert.match(moduleBarrel, /export \{ default as Badge \}/);
  for (const name of [
    "BADGE_DEFAULT_ELEMENT",
    "BADGE_DEFAULT_VARIANT",
    "BADGE_VARIANTS",
    "isBadgeElement",
    "isBadgeVariant",
    "BadgeElement",
    "BadgeProps",
    "BadgeVariant",
  ]) {
    assert.match(moduleBarrel, new RegExp(name));
  }
});
