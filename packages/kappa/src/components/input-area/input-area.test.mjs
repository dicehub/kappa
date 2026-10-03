import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  INPUT_AREA_DEFAULT_SIZE,
  INPUT_AREA_SIZES,
  isInputAreaSize,
  resolveInputAreaSize,
} from "./input-area.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("InputArea.vue");
const styles = source("input-area.css");
const barrel = source("index.ts");

test("shares the guarded Kappa control densities", () => {
  assert.deepEqual(INPUT_AREA_SIZES, ["xs", "sm", "base", "lg"]);
  assert.equal(INPUT_AREA_DEFAULT_SIZE, "base");

  for (const size of INPUT_AREA_SIZES) {
    assert.equal(isInputAreaSize(size), true);
    assert.equal(resolveInputAreaSize(size), size);
  }
  for (const invalid of ["default", "xl", "constructor", "__proto__", null]) {
    assert.equal(isInputAreaSize(invalid), false);
    assert.equal(resolveInputAreaSize(invalid), "base");
  }
});

test("composes the Ark Field textarea and forwards its behavior", () => {
  assert.match(component, /Field as ArkField/);
  assert.match(component, /<ArkField\.Textarea/);
  assert.match(component, /v-bind="textareaAttrs"/);
  assert.match(component, /class="kappa-input-area"/);
  assert.match(component, /data-slot="input-area"/);
  assert.match(component, /:autoresize="props\.autoresize"/);
  assert.match(component, /:as-child="props\.asChild"/);
  assert.match(component, /emit\('update:modelValue', \$event\)/);
  assert.match(component, /"aria-invalid": true/);
});

test("covers complete Kappa textarea states and platform preferences", () => {
  assert.match(styles, /\.kappa-input-area \{/);
  assert.match(styles, /font-family: var\(--kappa-font-sans/);
  assert.match(styles, /resize: vertical/);
  assert.match(styles, /\[data-autoresize\]/);
  for (const state of [":hover", ":focus-visible", ":disabled", ":read-only"]) {
    assert.match(styles, new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(styles, /\[aria-invalid="true"\]/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the component, public contracts, constants, and resolvers", () => {
  for (const name of [
    "InputArea",
    "InputAreaEmits",
    "InputAreaModelValue",
    "InputAreaProps",
    "InputAreaSize",
    "InputAreaSlots",
    "INPUT_AREA_DEFAULT_SIZE",
    "INPUT_AREA_SIZES",
    "isInputAreaSize",
    "resolveInputAreaSize",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
