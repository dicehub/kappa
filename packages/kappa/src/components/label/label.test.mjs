import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  LABEL_DEFAULT_ELEMENT,
  LABEL_DEFAULT_OPTIONAL_TEXT,
  LABEL_ELEMENTS,
  isLabelElement,
  resolveLabelElement,
  resolveLabelOptionalText,
} from "./label.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Label.vue");
const styles = source("label.css");
const barrel = source("index.ts");



test("renders a native label, forwards attributes, and supports content composition", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /defineSlots<LabelSlots>/);
  assert.match(component, /:is="resolvedElement"/);
  assert.match(component, /v-bind="forwardedAttrs"/);
  assert.match(component, /class="kappa-label"/);
  assert.match(component, /data-slot="label"/);
  assert.match(component, /:data-content="props\.asContent \? '' : undefined"/);
  assert.match(component, /:for="resolvedFor"/);
  assert.match(component, /props\.htmlFor !== undefined/);
  assert.match(component, /typeof attrs\.for === "string"/);
  assert.match(component, /data-slot="label-optional"/);
});

test("uses Kappa label typography, optional text, and explicit disabled styling", () => {
  assert.match(styles, /\.kappa-label \{/);
  assert.match(styles, /font-family: var\(--kappa-font-sans/);
  assert.match(styles, /font-size: 0\.8125rem/);
  assert.match(styles, /font-weight: 600/);
  assert.match(styles, /\.kappa-label__optional/);
  assert.match(styles, /var\(--kappa-subtle/);
  assert.match(styles, /\.kappa-label\[data-content\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[aria-disabled="true"\]/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
