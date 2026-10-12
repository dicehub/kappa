import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  TOGGLE_DEFAULT_SIZE,
  TOGGLE_DEFAULT_TYPE,
  TOGGLE_DEFAULT_VARIANT,
  TOGGLE_SIZES,
  TOGGLE_TYPES,
  TOGGLE_VARIANTS,
  isToggleSize,
  isToggleType,
  isToggleVariant,
  resolveToggleSize,
  resolveToggleType,
  resolveToggleVariant,
} from "./toggle.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Toggle.vue");
const styles = source("toggle.css");
const barrel = source("index.ts");



test("renders a controlled or uncontrolled native pressed button", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /const uncontrolledPressed = ref\(props\.defaultPressed\)/);
  assert.match(component, /props\.pressed \?\? uncontrolledPressed\.value/);
  assert.match(component, /if \(props\.pressed === undefined\)/);
  assert.match(component, /emit\("update:pressed", nextPressed\)/);
  assert.match(component, /emit\("pressedChange", nextPressed\)/);
  assert.match(component, /<button/);
  assert.match(component, /v-bind="\$attrs"/);
  assert.match(component, /:aria-pressed="resolvedPressed"/);
  assert.match(component, /:disabled="props\.disabled"/);
  assert.match(component, /:data-disabled="props\.disabled \? '' : undefined"/);
  assert.match(component, /:type="resolvedType"/);
  assert.match(component, /:data-state="resolvedPressed \? 'on' : 'off'"/);
  assert.match(component, /data-slot="toggle"/);
  assert.doesNotMatch(component, /@ark-ui|@zag-js/);
});

test("uses compact Kappa states without layout movement", () => {
  assert.match(styles, /var\(--kappa-tint/);
  assert.match(styles, /var\(--kappa-default/);
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /var\(--kappa-focus/);
  assert.match(styles, /\[data-state="on"\]/);
  assert.match(
    styles,
    /\[data-state="on"\]:hover:not\(:disabled\)[\s\S]*var\(--kappa-toggle-pressed-background\)/,
  );
  assert.match(styles, /\[data-variant="outline"\]/);
  assert.match(
    styles,
    /--kappa-toggle-border: var\(--kappa-line[\s\S]*--kappa-toggle-pressed-border: var\(--kappa-line/,
  );
  assert.match(styles, /\[data-size="sm"\][\s\S]*--kappa-toggle-size: 1\.75rem/);
  assert.match(styles, /\[data-size="lg"\][\s\S]*--kappa-toggle-size: 2\.25rem/);
  assert.match(styles, /padding-inline/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /transform:/);
  assert.doesNotMatch(styles, /margin-left|margin-right|padding-left|padding-right/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
