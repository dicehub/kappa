import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  NATIVE_SELECT_DEFAULT_SIZE,
  NATIVE_SELECT_SIZES,
  isNativeSelectSize,
  resolveNativeSelectSize,
} from "./native-select.ts";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./NativeSelect.vue");
const optionSource = readSource("./NativeSelectOption.vue");
const optGroupSource = readSource("./NativeSelectOptGroup.vue");
const styles = readSource("./native-select.css");
const moduleBarrel = readSource("./index.ts");
const componentBarrel = readSource("../index.ts");
const packageJson = JSON.parse(readSource("../../../package.json"));



test("renders one native select with model and attribute forwarding", () => {
  assert.match(rootSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(rootSource, /<select/);
  assert.match(rootSource, /v-bind="selectAttrs"/);
  assert.match(rootSource, /data-slot="native-select"/);
  assert.match(rootSource, /data-slot="native-select-icon"/);
  assert.match(rootSource, /aria-hidden="true"/);
  assert.match(rootSource, /@change="handleChange"/);
  assert.match(rootSource, /emit\("update:modelValue", value\)/);
  assert.match(rootSource, /element\.multiple/);
  assert.doesNotMatch(rootSource, /@ark-ui|@zag-js/);
});

test("renders native option and optgroup parts", () => {
  assert.match(optionSource, /<option/);
  assert.match(optionSource, /v-bind="\$attrs"/);
  assert.match(optionSource, /data-slot="native-select-option"/);
  assert.match(optGroupSource, /<optgroup/);
  assert.match(optGroupSource, /v-bind="\$attrs"/);
  assert.match(optGroupSource, /data-slot="native-select-optgroup"/);
});

test("uses logical Kappa styling and native platform fallbacks", () => {
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /inset-inline-end/);
  assert.match(styles, /appearance: none/);
  assert.match(styles, /\[data-size="xs"\]/);
  assert.match(styles, /\[multiple\]/);
  assert.match(styles, /background: Canvas/);
  assert.match(styles, /background: Highlight/);
  assert.match(styles, /color: HighlightText/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.native-select\s/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
