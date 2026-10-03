import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  FIELD_DEFAULT_ORIENTATION,
  FIELD_ORIENTATIONS,
  isFieldOrientation,
  resolveFieldOrientation,
} from "./field.ts";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Field.vue");
const providerSource = readSource("./FieldRootProvider.vue");
const labelSource = readSource("./FieldLabel.vue");
const inputSource = readSource("./FieldInput.vue");
const textareaSource = readSource("./FieldTextarea.vue");
const selectSource = readSource("./FieldSelect.vue");
const helperSource = readSource("./FieldHelperText.vue");
const errorSource = readSource("./FieldErrorText.vue");
const requiredSource = readSource("./FieldRequiredIndicator.vue");
const itemSource = readSource("./FieldItem.vue");
const contextSource = readSource("./FieldContext.vue");
const typesSource = readSource("./field.ts");
const styles = readSource("./field.css");
const moduleBarrel = readSource("./index.ts");
const componentBarrel = readSource("../index.ts");
const packageJson = JSON.parse(readSource("../../../package.json"));

test("guards the Kappa field orientation", () => {
  assert.deepEqual(FIELD_ORIENTATIONS, ["vertical", "horizontal", "responsive"]);
  assert.equal(FIELD_DEFAULT_ORIENTATION, "vertical");
  assert.equal(isFieldOrientation("horizontal"), true);
  assert.equal(isFieldOrientation("constructor"), false);
  assert.equal(resolveFieldOrientation("responsive"), "responsive");
  assert.equal(resolveFieldOrientation("diagonal"), "vertical");
  assert.match(typesSource, /FieldOrientation/);
});

test("preserves the Ark root contract and adds Kappa layout", () => {
  assert.match(rootSource, /<ArkField\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /class="kappa-field"/);
  assert.match(rootSource, /data-slot="field"/);
  assert.match(rootSource, /:data-orientation="resolvedOrientation"/);

  for (const prop of [
    "asChild",
    "disabled",
    "id",
    "ids",
    "invalid",
    "readOnly",
    "required",
    "target",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }
});

test("composes an external Ark field machine through RootProvider", () => {
  assert.match(providerSource, /<ArkField\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(providerSource, /:data-required="props\.value\.required/);
  assert.match(providerSource, /:data-orientation="resolvedOrientation"/);
  assert.match(providerSource, /v-bind="\$attrs"/);
});

test("wraps all semantic Ark parts and forwards attributes", () => {
  for (const [source, part, slot] of [
    [labelSource, "Label", "field-label"],
    [inputSource, "Input", "field-input"],
    [textareaSource, "Textarea", "field-textarea"],
    [selectSource, "Select", "field-select"],
    [helperSource, "HelperText", "field-helper-text"],
    [errorSource, "ErrorText", "field-error-text"],
    [requiredSource, "RequiredIndicator", "field-required-indicator"],
  ]) {
    assert.match(source, new RegExp(`<ArkField\\.${part}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
    assert.match(source, /:as-child="props\.asChild"/);
  }

  for (const source of [inputSource, textareaSource, selectSource]) {
    assert.match(source, /@update:model-value="emit\('update:modelValue', \$event\)"/);
  }

  assert.match(textareaSource, /:autoresize="props\.autoresize"/);
  assert.match(selectSource, /data-slot="field-select-control"/);
  assert.match(selectSource, /class="kappa-field__select-icon"/);
  assert.match(selectSource, /aria-hidden="true"/);
  assert.match(selectSource, /focusable="false"/);
  assert.match(requiredSource, /v-if="field\.required"/);
  assert.match(requiredSource, /<slot>\*<\/slot>/);
  assert.match(requiredSource, /v-else-if="\$slots\.fallback"/);
  assert.match(requiredSource, /data-optional=""/);
});

test("keeps Field.Item renderless and exposes context", () => {
  assert.match(itemSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(itemSource, /<ArkField\.Item :value="props\.value">/);
  assert.doesNotMatch(itemSource, /class="kappa-field/);
  assert.match(contextSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(contextSource, /<ArkField\.Context v-slot="context">/);
  assert.match(contextSource, /<slot v-bind="context"/);
});

test("exports named parts, compound API, types, and Ark utilities", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Label",
    "Input",
    "Textarea",
    "Select",
    "HelperText",
    "ErrorText",
    "RequiredIndicator",
    "Item",
    "Context",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Field${part}`));
    assert.match(moduleBarrel, new RegExp(`Field${part}`));
  }

  assert.match(moduleBarrel, /fieldAnatomy/);
  assert.match(moduleBarrel, /useField/);
  assert.match(moduleBarrel, /useFieldContext/);
  assert.match(componentBarrel, /export \* from "\.\/field"/);
  assert.equal(packageJson.exports["./components/*"]["kappa-source"], "./src/components/*/index.ts");
  assert.equal(packageJson.exports["./components/*"].types, "./dist/components/*/index.d.ts");
});

test("uses semantic, state-driven, logical Kappa styling", () => {
  assert.match(styles, /border-radius: 0\.125rem/);
  assert.match(styles, /var\(--kappa-input-border, #dcdcdc\)/);
  assert.match(styles, /var\(--kappa-focus, #247ab7\)/);
  assert.match(styles, /box-shadow: 0 0 5px var\(--kappa-focus/);
  assert.doesNotMatch(styles, /outline-color: var\(--kappa-focus/);
  assert.match(styles, /\[data-orientation="horizontal"\]/);
  assert.match(styles, /\[data-orientation="responsive"\]/);
  assert.match(styles, /@media \(min-width: 40rem\)/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /appearance: none/);
  assert.match(styles, /\[data-optional\]/);
  assert.match(styles, /inset-inline-end: 0\.75rem/);
  assert.match(styles, /padding-inline-end: 2\.25rem/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /(?:linear|radial)-gradient/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
