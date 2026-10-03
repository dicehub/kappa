import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  INPUT_GROUP_ADDON_ALIGNS,
  INPUT_GROUP_DEFAULT_ADDON_ALIGN,
  INPUT_GROUP_DEFAULT_SIZE,
  INPUT_GROUP_SIZES,
  isInputGroupAddonAlign,
  isInputGroupInvalid,
  isInputGroupSize,
  resolveInputGroupAddonAlign,
  resolveInputGroupAriaBoolean,
  resolveInputGroupSize,
} from "./input-group.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const rootSource = source("InputGroup.vue");
const addonSource = source("InputGroupAddon.vue");
const inputSource = source("InputGroupInput.vue");
const textareaSource = source("InputGroupTextarea.vue");
const buttonSource = source("InputGroupButton.vue");
const textSource = source("InputGroupText.vue");
const styles = source("input-group.css");
const barrel = source("index.ts");

test("defines guarded sizes, addon alignment, and state helpers", () => {
  assert.deepEqual(INPUT_GROUP_SIZES, ["xs", "sm", "base", "lg"]);
  assert.deepEqual(INPUT_GROUP_ADDON_ALIGNS, [
    "inline-start",
    "inline-end",
    "block-start",
    "block-end",
  ]);
  assert.equal(INPUT_GROUP_DEFAULT_SIZE, "base");
  assert.equal(INPUT_GROUP_DEFAULT_ADDON_ALIGN, "inline-start");

  for (const size of INPUT_GROUP_SIZES) {
    assert.equal(isInputGroupSize(size), true);
    assert.equal(resolveInputGroupSize(size), size);
  }
  for (const align of INPUT_GROUP_ADDON_ALIGNS) {
    assert.equal(isInputGroupAddonAlign(align), true);
    assert.equal(resolveInputGroupAddonAlign(align), align);
  }
  for (const invalid of ["default", "xl", "constructor", "__proto__", null, 1]) {
    assert.equal(isInputGroupSize(invalid), false);
    assert.equal(isInputGroupAddonAlign(invalid), false);
  }
  assert.equal(resolveInputGroupSize("bad"), "base");
  assert.equal(resolveInputGroupAddonAlign("bad"), "inline-start");
  assert.equal(isInputGroupInvalid({ "aria-invalid": "true" }), true);
  assert.equal(isInputGroupInvalid({ "data-invalid": "" }), true);
  assert.equal(isInputGroupInvalid({ "data-invalid": false }), false);
  assert.equal(resolveInputGroupAriaBoolean(true), "true");
  assert.equal(resolveInputGroupAriaBoolean("false"), "false");
  assert.equal(resolveInputGroupAriaBoolean("other"), undefined);
});

test("renders an attribute-transparent compound native composition", () => {
  for (const partSource of [
    rootSource,
    addonSource,
    inputSource,
    textareaSource,
    buttonSource,
    textSource,
  ]) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  }
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /role="group"/);
  assert.match(rootSource, /data-slot="input-group"/);
  assert.match(addonSource, /data-slot="input-group-addon"/);
  assert.match(addonSource, /:data-align="resolvedAlign"/);
  assert.match(addonSource, /@mousedown="handleMousedown"/);
  assert.match(addonSource, /event\.preventDefault\(\)/);
  assert.match(addonSource, /data-slot="input-group-control"/);
  assert.match(inputSource, /<input/);
  assert.match(inputSource, /"data-slot": "input-group-control"/);
  assert.match(inputSource, /emit\("update:modelValue", value\)/);
  assert.match(inputSource, /emit\("valueChange", value\)/);
  assert.match(inputSource, /defaultValue: props\.defaultValue/);
  assert.doesNotMatch(inputSource, /props\.defaultValue\s*\}\s*:\s*\{\s*value:/);
  assert.match(textareaSource, /<textarea/);
  assert.match(textareaSource, /"data-slot": "input-group-control"/);
  assert.match(textareaSource, /defaultValue: props\.defaultValue/);
  assert.match(buttonSource, /<Button v-bind="buttonAttrs"/);
  assert.match(buttonSource, /"data-input-group-button": ""/);
  assert.match(textSource, /data-slot="input-group-text"/);
  for (const partSource of [rootSource, addonSource, inputSource, textareaSource, buttonSource, textSource]) {
    assert.doesNotMatch(partSource, /@ark-ui|@zag-js/);
  }
});

test("uses Kappa tokens and complete control states", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-danger",
    "--kappa-focus",
    "--kappa-focus-soft",
    "--kappa-line",
    "--kappa-muted",
    "--kappa-subtle",
    "--kappa-tint",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  for (const state of ["focus-within", "data-invalid", "data-disabled", "disabled", "readonly"]) {
    assert.match(styles, new RegExp(state));
  }
  assert.match(styles, /data-align="inline-start"/);
  assert.match(styles, /data-align="block-end"/);
  assert.match(styles, /--kappa-input-group-icon-size: 1rem/);
  assert.match(styles, /__addon :is\(svg, \[data-icon\]\)/);
  assert.match(
    styles,
    /var\(--kappa-button-icon-size, var\(--kappa-input-group-icon-size\)\)/,
  );
  assert.match(styles, /__text[\s\S]*gap: 0\.375rem/);
  assert.match(
    styles,
    /__button\.kappa-button\[data-variant="ghost"\][\s\S]*--kappa-button-hover-background: transparent/,
  );
  assert.match(styles, /data-align\^="block-"[\s\S]*margin-inline-start: auto/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the compound API and public contracts", () => {
  assert.match(barrel, /export const InputGroup = Object\.assign/);
  for (const part of ["Addon", "Button", "Input", "Textarea", "Text"]) {
    assert.match(barrel, new RegExp(`${part}: InputGroup${part}`));
  }
  for (const name of [
    "InputGroupProps",
    "InputGroupAddonProps",
    "InputGroupButtonProps",
    "InputGroupInputProps",
    "InputGroupTextareaProps",
    "InputGroupTextProps",
    "InputGroupSize",
    "InputGroupAddonAlign",
    "InputGroupControlEmits",
    "resolveInputGroupSize",
    "resolveInputGroupAddonAlign",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
