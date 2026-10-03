import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  EXPANDABLE_TEXT_DEFAULT_COLLAPSE_LABEL,
  EXPANDABLE_TEXT_DEFAULT_EXPAND_LABEL,
  EXPANDABLE_TEXT_DEFAULT_LINES,
  resolveExpandableTextLines,
} from "./expandable-text.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("ExpandableText.vue");
const contracts = source("expandable-text.ts");
const styles = source("expandable-text.css");
const barrel = source("index.ts");
const componentBarrel = source("../index.ts");

test("defines stable line and label defaults", () => {
  assert.equal(EXPANDABLE_TEXT_DEFAULT_LINES, 3);
  assert.equal(EXPANDABLE_TEXT_DEFAULT_EXPAND_LABEL, "Show more");
  assert.equal(EXPANDABLE_TEXT_DEFAULT_COLLAPSE_LABEL, "Show less");
});

test("normalizes the visible line count", () => {
  assert.equal(resolveExpandableTextLines(1), 1);
  assert.equal(resolveExpandableTextLines(4.9), 4);
  for (const value of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, "3", null]) {
    assert.equal(resolveExpandableTextLines(value), EXPANDABLE_TEXT_DEFAULT_LINES);
  }
});

test("composes Ark Collapsible and measures real overflow", () => {
  assert.match(component, /Collapsible as ArkCollapsible/);
  assert.match(component, /<ArkCollapsible\.Root/);
  assert.match(component, /<ArkCollapsible\.Content/);
  assert.match(component, /<ArkCollapsible\.Trigger/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /body\.scrollHeight > lineHeight \* resolvedLines\.value \+ 1/);
  assert.match(component, /v-if="overflowing"/);
  assert.match(component, /:collapsed-height="collapsedHeight"/);
});

test("supports controlled state, accessible labels, and a scoped trigger slot", () => {
  assert.match(component, /props\.open === undefined \? internalOpen\.value : props\.open/);
  assert.match(component, /emit\("update:open", details\.open\)/);
  assert.match(component, /emit\("openChange", details\)/);
  assert.match(component, /:aria-label="triggerLabel"/);
  assert.match(component, /:disabled="props\.disabled"/);
  assert.match(component, /<slot name="trigger" :open="resolvedOpen" :label="triggerLabel">/);
  for (const name of ["lines", "defaultOpen", "open", "disabled", "id", "expandLabel", "collapseLabel"]) {
    assert.match(contracts, new RegExp(`${name}\\??:`));
  }
});

test("exports the component, contracts, defaults, and resolver", () => {
  for (const name of [
    "ExpandableText",
    "ExpandableTextProps",
    "ExpandableTextEmits",
    "ExpandableTextSlots",
    "ExpandableTextTriggerSlotProps",
    "EXPANDABLE_TEXT_DEFAULT_LINES",
    "resolveExpandableTextLines",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
  assert.match(componentBarrel, /export \* from "\.\/expandable-text"/);
});

test("uses Kappa tokens, logical properties, motion preferences, and forced colors", () => {
  assert.match(styles, /var\(--kappa-default/);
  assert.match(styles, /var\(--kappa-accent/);
  assert.match(styles, /inline-size/);
  assert.match(styles, /block-size/);
  assert.match(styles, /overflow-anchor: none/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /:focus-visible/);
  assert.doesNotMatch(
    styles,
    /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:collapsed-height|height)(?![\w-]))[a-z][\w-]*/,
  );
});
