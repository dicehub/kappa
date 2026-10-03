import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { addNumberInputDecimalSteps } from "./number-input-decimal.ts";
import { resolveNumberInputPointerStep } from "./number-input-scrub-steps.ts";
import {
  NUMBER_INPUT_DEFAULT_EDIT_ALIGNMENT,
  NUMBER_INPUT_SIZES,
  isNumberInputEditAlignment,
  isNumberInputSize,
  resolveNumberInputEditAlignment,
  resolveNumberInputSize,
} from "./number-input.ts";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./NumberInput.vue");
const machineSource = readSource("./NumberInputMachine.vue");
const providerSource = readSource("./NumberInputRootProvider.vue");
const labelSource = readSource("./NumberInputLabel.vue");
const controlSource = readSource("./NumberInputControl.vue");
const inputSource = readSource("./NumberInputInput.vue");
const valueTextSource = readSource("./NumberInputValueText.vue");
const incrementSource = readSource("./NumberInputIncrementTrigger.vue");
const decrementSource = readSource("./NumberInputDecrementTrigger.vue");
const scrubberSource = readSource("./NumberInputScrubber.vue");
const scrubbableInputSource = readSource("./NumberInputScrubbableInput.vue");
const scrubbableBehaviorSource = readSource("./use-scrubbable-number-input.ts");
const scrubStepsSource = readSource("./number-input-scrub-steps.ts");
const decimalSource = readSource("./number-input-decimal.ts");
const unitSource = readSource("./NumberInputUnit.vue");
const contextSource = readSource("./NumberInputContext.vue");
const typesSource = readSource("./number-input.ts");
const styles = readSource("./number-input.css");
const moduleBarrel = readSource("./index.ts");

test("supports reference pointer multipliers without changing the defaults", () => {
  const steps = { step: 1, smallStep: 0.1, largeStep: 10 };
  const keys = (ctrlKey = false, shiftKey = false, altKey = false) => ({ ctrlKey, shiftKey, altKey });
  const sensitivity = { control: 100, shift: 0.02, alt: 10 };
  assert.equal(resolveNumberInputPointerStep(keys(), steps, sensitivity), 1);
  assert.equal(resolveNumberInputPointerStep(keys(true), steps, sensitivity), 100);
  assert.equal(resolveNumberInputPointerStep(keys(false, true), steps, sensitivity), 0.02);
  assert.equal(resolveNumberInputPointerStep(keys(false, false, true), steps, sensitivity), 10);
  assert.equal(resolveNumberInputPointerStep(keys(true, true, true), steps, sensitivity), 100);
  assert.equal(resolveNumberInputPointerStep(keys(false, true, true), steps, sensitivity), 0.02);
  assert.equal(resolveNumberInputPointerStep(keys(true), steps), 0.1);
  assert.equal(resolveNumberInputPointerStep(keys(false, false, true), steps), 0.1);
  assert.equal(resolveNumberInputPointerStep(keys(false, true), steps), 10);
  for (const control of [undefined, 0, -1, NaN, Infinity]) {
    assert.equal(resolveNumberInputPointerStep(keys(true), steps, { control }), 1);
  }
});

test("accepts xs and preserves the default size fallback", () => {
  assert.deepEqual(NUMBER_INPUT_SIZES, ["xs", "sm", "default", "lg"]);
  for (const size of NUMBER_INPUT_SIZES) {
    assert.equal(isNumberInputSize(size), true);
    assert.equal(resolveNumberInputSize(size), size);
  }
  for (const value of [undefined, null, "compact", 20]) {
    assert.equal(isNumberInputSize(value), false);
    assert.equal(resolveNumberInputSize(value), "default");
  }
});

test("preserves the Ark root contract and adds Kappa direction and size", () => {
  for (const prop of [
    "allowMouseWheel",
    "allowOverflow",
    "asChild",
    "clampValueOnBlur",
    "defaultValue",
    "dir",
    "disabled",
    "focusInputOnChange",
    "form",
    "formatOptions",
    "id",
    "ids",
    "inputMode",
    "invalid",
    "largeStep",
    "locale",
    "max",
    "min",
    "modelValue",
    "name",
    "pattern",
    "readOnly",
    "required",
    "smallStep",
    "spinOnPress",
    "step",
    "translations",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  assert.match(typesSource, /NUMBER_INPUT_SIZES = \["xs", "sm", "default", "lg"\]/);
  assert.match(typesSource, /NUMBER_INPUT_DEFAULT_SIZE = "default"/);
  assert.match(typesSource, /NumberInputDirection = "ltr" \| "rtl"/);
  assert.match(rootSource, /LocaleProvider :locale="providerLocale"/);
  assert.match(rootSource, /props\.dir === "rtl" \? "ar" : "en-US"/);
  assert.match(rootSource, /numberLocale = computed\(\(\) => props\.locale \?\? inheritedLocale\.value\.locale\)/);
  assert.match(rootSource, /locale: numberLocale\.value/);
});

test("bridges Ark value events, including the installed value commit callback", () => {
  assert.match(machineSource, /useNumberInput\(computed\(\(\) => props\.machineProps\)\)/);
  assert.match(machineSource, /<NumberInputRootProvider/);
  assert.match(rootSource, /onFocusChange: handleFocusChange/);
  assert.match(rootSource, /onValueChange: handleValueChange/);
  assert.match(rootSource, /onValueCommit: handleValueCommit/);
  assert.match(rootSource, /onValueInvalid: handleValueInvalid/);
  assert.match(rootSource, /emit\("update:modelValue", details\.value\)/);
  assert.match(typesSource, /valueCommit: \[details: NumberInputValueCommitDetails\]/);
  assert.match(typesSource, /"update:modelValue": \[value: string\]/);
});

test("extends the opt-in wheel behavior to an unfocused hovered input", () => {
  assert.match(rootSource, /:allow-mouse-wheel="props\.allowMouseWheel"/);
  assert.match(machineSource, /:allow-mouse-wheel="props\.allowMouseWheel"/);
  assert.match(providerSource, /@wheel="handleWheel"/);
  assert.match(providerSource, /!props\.allowMouseWheel/);
  assert.match(providerSource, /props\.value\.focused/);
  assert.match(providerSource, /event\.preventDefault\(\)/);
  assert.match(providerSource, /props\.value\.increment\(\)/);
  assert.match(providerSource, /props\.value\.decrement\(\)/);
});

test("provides Kappa state and size attributes through RootProvider", () => {
  assert.match(providerSource, /<ArkNumberInput\.RootProvider/);
  assert.match(providerSource, /v-bind="\$attrs"/);
  assert.match(providerSource, /class="kappa-number-input"/);
  assert.match(providerSource, /data-slot="number-input"/);
  assert.match(providerSource, /:data-readonly="inputProps\.readonly/);
  assert.match(providerSource, /:data-required="inputProps\.required/);
  assert.match(providerSource, /:data-size="resolvedSize"/);
  assert.match(providerSource, /:value="props\.value"/);
});

test("wraps all semantic Ark parts and forwards attributes", () => {
  for (const [source, part, slot] of [
    [labelSource, "Label", "number-input-label"],
    [controlSource, "Control", "number-input-control"],
    [inputSource, "Input", "number-input-input"],
    [valueTextSource, "ValueText", "number-input-value-text"],
    [incrementSource, "IncrementTrigger", "number-input-increment-trigger"],
    [decrementSource, "DecrementTrigger", "number-input-decrement-trigger"],
    [scrubberSource, "Scrubber", "number-input-scrubber"],
  ]) {
    assert.match(source, new RegExp(`<ArkNumberInput\\.${part}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
    assert.match(source, /:as-child="props\.asChild"/);
  }

  assert.match(contextSource, /<ArkNumberInput\.Context v-slot="context">/);
  assert.match(contextSource, /<slot v-bind="context"/);
});

test("ships clear default glyphs with slot overrides", () => {
  assert.match(incrementSource, /<slot>/);
  assert.match(incrementSource, /M8 4v8M4 8h8/);
  assert.match(decrementSource, /<slot>/);
  assert.match(decrementSource, /M4 8h8/);
  assert.match(scrubberSource, /<slot>/);
  assert.match(scrubberSource, /M5 4 1\.75 8 5 12M11 4l3\.25 4L11 12/);

  for (const source of [incrementSource, decrementSource, scrubberSource]) {
    assert.match(source, /aria-hidden="true"/);
    assert.match(source, /focusable="false"/);
    assert.equal((source.match(/<svg/g) ?? []).length, 1);
  }
});

test("makes formatted value text and unit composition useful by default", () => {
  assert.match(valueTextSource, /useNumberInputContext/);
  assert.match(valueTextSource, /:value="value"/);
  assert.match(valueTextSource, /:value-as-number="valueAsNumber"/);
  assert.match(valueTextSource, /\{\{ value \}\}/);
  assert.match(unitSource, /<span v-bind="\$attrs"/);
  assert.match(unitSource, /data-slot="number-input-unit"/);
  assert.match(typesSource, /NumberInputUnitProps = HTMLAttributes/);
});

test("blocks the upstream readonly scrubber gap without custom value logic", () => {
  assert.match(scrubberSource, /getInputProps\(\)\.readonly/);
  assert.match(scrubberSource, /@mousedown\.capture="guardReadOnlyScrub"/);
  assert.match(scrubberSource, /:style="isReadOnly \? \{ cursor: 'default' \} : undefined"/);
  assert.match(scrubberSource, /event\.preventDefault\(\)/);
  assert.match(scrubberSource, /event\.stopImmediatePropagation\(\)/);
  assert.doesNotMatch(rootSource + machineSource + scrubberSource, /DH\.val|awaitChanges|pointerLock|requestPointerLock/);
});

test("adds an opt-in whole-field scrub and edit interaction", () => {
  assert.match(scrubbableInputSource, /<ArkNumberInput\.Input/);
  assert.match(scrubbableInputSource, /data-slot="number-input-scrubbable-input"/);
  assert.match(scrubbableInputSource, /data-slot="number-input-scrubbable-display"/);
  assert.match(scrubbableInputSource, /:data-edit-alignment="editAlignment"/);
  assert.match(scrubbableInputSource, /:data-dragging="dragging/);
  assert.match(scrubbableInputSource, /@pointerdown="handlePointerDown"/);
  assert.match(scrubbableInputSource, /@blur="handleInputBlur"/);
  assert.match(scrubbableInputSource, /@focus="handleInputFocus"/);
  assert.match(scrubbableBehaviorSource, /editorFocused\.value && !dragging\.value/);
  assert.match(scrubbableBehaviorSource, /Math\.abs\(event\.clientX - startX\) <= dragThreshold\.value/);
  assert.match(scrubbableBehaviorSource, /resolveNumberInputPointerStep\(event, scrubSteps\.value, scrubSensitivity\.value\)/);
  assert.match(scrubbableBehaviorSource, /event\.key !== "Escape"/);
  assert.match(scrubbableBehaviorSource, /restoreStartValue/);
  assert.match(scrubbableBehaviorSource, /setPointerCapture/);
  assert.match(scrubbableBehaviorSource, /pointercancel/);
  assert.match(scrubbableBehaviorSource, /pointerlockchange/);
  assert.match(scrubbableBehaviorSource, /pointerlockerror/);
  assert.match(scrubbableBehaviorSource, /lockRequestPending/);
  assert.match(scrubbableBehaviorSource, /visibilitychange/);
  assert.match(scrubbableBehaviorSource, /watch\(/);
  assert.match(scrubbableBehaviorSource, /finish\(\{ restore: true \}\)/);
  assert.match(scrubbableBehaviorSource, /onBeforeUnmount\(\(\) => finish\(\)\)/);
  assert.match(decimalSource, /10n \*\* BigInt/);
  assert.doesNotMatch(decimalSource, /Math\.min\(\s*12/);
  assert.match(scrubStepsSource, /step \/ 10/);
  assert.match(scrubStepsSource, /step \* 10/);
});

test("guards the scrubbable editor alignment", () => {
  assert.equal(NUMBER_INPUT_DEFAULT_EDIT_ALIGNMENT, "start");
  assert.equal(isNumberInputEditAlignment("center"), true);
  assert.equal(isNumberInputEditAlignment("constructor"), false);
  assert.equal(resolveNumberInputEditAlignment("center"), "center");
  assert.equal(resolveNumberInputEditAlignment("middle"), "start");
  assert.equal(resolveNumberInputEditAlignment("constructor"), "start");
  assert.match(styles, /\[data-edit-alignment="center"\]/);
  assert.match(
    styles,
    /:hover:not\(\s*\[data-disabled\],\s*\[data-readonly\],\s*\[data-editing\]\s*\)/,
  );
});

test("preserves decimal and scientific-notation scrub steps", () => {
  assert.equal(addNumberInputDecimalSteps(0.2, 0.1, 1), 0.3);
  assert.equal(addNumberInputDecimalSteps(0.35, 0.001, 29), 0.379);
  assert.equal(addNumberInputDecimalSteps(0, 1e-13, 1), 1e-13);
  assert.equal(addNumberInputDecimalSteps(1e-13, 1e-13, -1), 0);
});

test("exports named parts, the compound API, and Ark context utilities", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Label",
    "Control",
    "Input",
    "ValueText",
    "IncrementTrigger",
    "DecrementTrigger",
    "Scrubber",
    "ScrubbableInput",
    "Unit",
    "Context",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: NumberInput${part}`));
    assert.match(moduleBarrel, new RegExp(`NumberInput${part}`));
  }

  assert.match(moduleBarrel, /useNumberInput/);
  assert.match(moduleBarrel, /useNumberInputContext/);
  assert.match(moduleBarrel, /numberInputAnatomy/);
  assert.match(moduleBarrel, /UseNumberInputProps/);
});

test("uses flat, state-driven, logical Kappa styling", () => {
  assert.match(styles, /\[data-size="sm"\]/);
  assert.match(styles, /\[data-size="lg"\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /border-color: var\(--kappa-danger, #b42318\)/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /\[data-scrubbing\]/);
  assert.match(styles, /:focus-within/);
  assert.match(styles, /\.kappa-number-input__trigger--decrement \{\s*border-inline-end:/);
  assert.match(styles, /\.kappa-number-input__trigger--increment \{\s*border-inline-start:/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /box-shadow|(?:linear|radial)-gradient/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
