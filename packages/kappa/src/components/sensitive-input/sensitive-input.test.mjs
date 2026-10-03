import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  SENSITIVE_INPUT_DEFAULT_SIZE,
  SENSITIVE_INPUT_SIZES,
  isSensitiveInputSize,
  resolveSensitiveInputSize,
} from "./sensitive-input.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const component = source("SensitiveInput.vue");
const styles = source("sensitive-input.css");
const barrel = source("index.ts");

test("guards and resolves supported input densities", () => {
  assert.deepEqual(SENSITIVE_INPUT_SIZES, ["xs", "sm", "base", "lg"]);
  assert.equal(SENSITIVE_INPUT_DEFAULT_SIZE, "base");
  for (const size of SENSITIVE_INPUT_SIZES) {
    assert.equal(isSensitiveInputSize(size), true);
    assert.equal(resolveSensitiveInputSize(size), size);
  }
  for (const invalid of ["xl", "default", "__proto__", null, 4]) {
    assert.equal(isSensitiveInputSize(invalid), false);
    assert.equal(resolveSensitiveInputSize(invalid), "base");
  }
});

test("preserves controlled and uncontrolled value contracts", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /props\.defaultValue/);
  assert.match(component, /props\.modelValue === undefined/);
  assert.match(component, /emit\("update:modelValue", value\)/);
  assert.match(component, /emit\("valueChange", value\)/);
  assert.match(component, /v-bind="inputAttrs"/);
  assert.match(component, /useId/);
  assert.match(component, /:class="attrs\.class"/);
  assert.match(component, /:style="attrs\.style"/);
  assert.match(component, /data-slot="sensitive-input-input"/);
});

test("covers masking, reveal, escape, and copy behavior", () => {
  assert.match(component, /mode = ref<SensitiveInputMode>/);
  assert.match(component, /isRevealed\.value \? "text" : "password"/);
  assert.match(component, /:type="inputType"/);
  assert.match(component, /Reveal value/);
  assert.match(component, /Hide value/);
  assert.match(component, /event\.key === "Escape"/);
  assert.match(component, /event\.key === "Enter"/);
  assert.match(component, /event\.key === " "/);
  assert.match(component, /@blur="handleBlur"/);
  assert.match(component, /navigator\.clipboard\?\.writeText/);
  assert.match(component, /document\.execCommand\("copy"\)/);
  assert.match(component, /emit\("copy"\)/);
  assert.match(component, /data-slot="sensitive-input-mask"/);
  assert.match(component, /Click to reveal/);
  assert.match(component, /data-slot="sensitive-input-toggle"/);
  assert.match(component, /copied \? "Copied!" : "Copy"/);
  assert.match(styles, /__copy[\s\S]*min-inline-size: 4\.25rem/);
  assert.match(styles, /__copy[\s\S]*padding-inline: 0\.625rem/);
  assert.match(styles, /data-masked[\s\S]*:is\(:hover, :focus-within\)[\s\S]*__mask-reveal/);
  assert.match(styles, /control:is\(:hover, :focus-within\) > \.kappa-sensitive-input__copy/);
  assert.match(component, /@keydown="handleKeydown"/);
});

test("masks when focus leaves the control and tracks clear transitions", () => {
  assert.match(component, /@focusout="handleControlFocusOut"/);
  assert.match(component, /const handleControlFocusOut = \(event: FocusEvent\)/);
  assert.match(component, /@keydown\.stop="handleActionKeydown"/);
  assert.match(component, /const wasRevealed = isRevealed\.value/);
  assert.match(component, /if \(wasRevealed\) emit\("visibilityChange", false\)/);
  assert.match(component, /if \(!hasValue\.value \|\| !isRevealed\.value\) return;/);
});

test("styles complete control states with Kappa tokens", () => {
  assert.match(styles, /\.kappa-sensitive-input\s*\{/);
  for (const selector of ["data-state=\"masked\"", ":focus-within", "data-invalid", "data-disabled", "data-readonly", ":focus-visible"]) {
    assert.match(styles, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(styles, /var\(--kappa-focus/);
  assert.match(styles, /var\(--kappa-danger/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the component and public contract", () => {
  for (const name of [
    "SensitiveInput",
    "SensitiveInputProps",
    "SensitiveInputEmits",
    "SensitiveInputMode",
    "SensitiveInputModelValue",
    "SENSITIVE_INPUT_SIZES",
    "SENSITIVE_INPUT_DEFAULT_SIZE",
    "isSensitiveInputSize",
    "resolveSensitiveInputSize",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
