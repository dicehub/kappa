import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  INPUT_DEFAULT_SIZE,
  INPUT_SIZES,
  isInputSize,
  resolveInputSize,
} from "./input.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("Input.vue");
const styles = source("input.css");
const barrel = source("index.ts");

test("defines guarded input size variants", () => {
  assert.deepEqual(INPUT_SIZES, ["xs", "sm", "base", "lg"]);
  assert.equal(INPUT_DEFAULT_SIZE, "base");

  for (const size of INPUT_SIZES) {
    assert.equal(isInputSize(size), true);
    assert.equal(resolveInputSize(size), size);
  }
  for (const invalid of ["default", "xl", "constructor", "__proto__", null]) {
    assert.equal(isInputSize(invalid), false);
    assert.equal(resolveInputSize(invalid), "base");
  }
});

test("renders one native input and preserves Vue and native event contracts", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /<input/);
  assert.match(component, /v-bind="inputAttrs"/);
  assert.match(component, /class="kappa-input"/);
  assert.match(component, /data-slot="input"/);
  assert.match(component, /:data-size="resolvedSize"/);
  assert.match(component, /emit\("update:modelValue"/);
  assert.match(component, /props\.modelValue !== undefined/);
  assert.match(component, /"data-1p-ignore": "true"/);
  assert.match(component, /"data-lpignore": "true"/);
});

test("covers complete Kappa input states without external visual namespaces", () => {
  assert.match(styles, /\.kappa-input \{/);
  assert.match(styles, /--kappa-input-padding: 0\.75rem/);
  assert.match(styles, /--kappa-input-radius: 0\.125rem/);
  assert.match(styles, /var\(--kappa-input-border, #dcdcdc\)/);
  assert.match(styles, /var\(--kappa-focus, #247ab7\)/);
  assert.match(styles, /box-shadow: 0 0 5px var\(--kappa-focus/);
  assert.doesNotMatch(styles, /outline-color: var\(--kappa-focus/);
  assert.match(styles, /font-family: var\(--kappa-font-sans/);
  for (const state of [":hover", ":focus-visible", ":disabled", ":read-only"]) {
    assert.match(styles, new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(styles, /\[aria-invalid="true"\]/);
  assert.match(styles, /::file-selector-button/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the component, public types, constants, and resolvers", () => {
  for (const name of [
    "Input",
    "InputEmits",
    "InputModelValue",
    "InputProps",
    "InputSize",
    "INPUT_DEFAULT_SIZE",
    "INPUT_SIZES",
    "isInputSize",
    "resolveInputSize",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
