import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Checkbox.vue");
const rootProviderSource = readSource("./CheckboxRootProvider.vue");
const groupSource = readSource("./CheckboxGroup.vue");
const controlSource = readSource("./CheckboxControl.vue");
const indicatorSource = readSource("./CheckboxIndicator.vue");
const labelSource = readSource("./CheckboxLabel.vue");
const contextSource = readSource("./CheckboxContext.vue");
const typesSource = readSource("./checkbox.ts");
const styles = readSource("./checkbox.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the exact Ark root prop and event contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/checkbox"/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="checkbox"/);

  for (const prop of [
    "asChild",
    "checked",
    "defaultChecked",
    "disabled",
    "form",
    "id",
    "ids",
    "invalid",
    "name",
    "readOnly",
    "required",
    "value",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const binding of [
    "as-child",
    "checked",
    "default-checked",
    "disabled",
    "form",
    "id",
    "ids",
    "invalid",
    "name",
    "read-only",
    "required",
    "value",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /@checked-change="handleCheckedChange"/);
  assert.match(rootSource, /emit\("checkedChange", details\)/);
  assert.match(rootSource, /@update:checked="emit\('update:checked', \$event\)"/);
  assert.match(typesSource, /"update:checked": \[checked: CheckboxCheckedState\]/);
});

test("normalizes bare boolean attributes for the mixed checked-state union", () => {
  assert.match(typesSource, /resolveCheckboxCheckedState/);
  assert.match(typesSource, /value === "" \? true : value/);
  assert.match(rootSource, /:checked="normalizedChecked"/);
  assert.match(rootSource, /:default-checked="normalizedDefaultChecked"/);
  assert.match(rootSource, /resolveCheckboxCheckedState\(props\.checked\)/);
  assert.match(rootSource, /resolveCheckboxCheckedState\(props\.defaultChecked\)/);
});

test("syncs the native mixed state for assistive technology", () => {
  assert.match(rootSource, /syncCheckboxIndeterminate/);
  assert.match(rootSource, /useTemplateRef\("root"\)/);
  assert.match(rootProviderSource, /syncCheckboxIndeterminate/);
  assert.match(rootProviderSource, /props\.value\.indeterminate/);
});

test("renders the hidden input for native form submission by default", () => {
  assert.match(rootSource, /<ArkCheckbox\.HiddenInput \/>/);
  assert.match(rootProviderSource, /<ArkCheckbox\.HiddenInput \/>/);
  assert.match(rootSource, /<ArkCheckbox\.Root/);
  assert.match(rootProviderSource, /<ArkCheckbox\.RootProvider/);
  assert.match(rootProviderSource, /:value="value"/);
  assert.match(rootProviderSource, /data-slot="checkbox"/);
});

test("provides default check and indeterminate marks inside control", () => {
  assert.match(controlSource, /<ArkCheckbox\.Control/);
  assert.match(controlSource, /data-slot="checkbox-control"/);
  assert.match(controlSource, /<CheckboxIndicator>/);
  assert.match(controlSource, /<CheckboxIndicator indeterminate>/);
  assert.equal((controlSource.match(/<svg/g) ?? []).length, 2);
  assert.match(controlSource, /viewBox="0 0 16 16"/);
  assert.match(controlSource, /stroke="currentColor"/);
  assert.match(controlSource, /aria-hidden="true"/);

  assert.match(indicatorSource, /<ArkCheckbox\.Indicator/);
  assert.match(indicatorSource, /data-slot="checkbox-indicator"/);
  assert.match(indicatorSource, /:indeterminate="indeterminate"/);
  assert.match(typesSource, /indeterminate\?: boolean/);
});

test("keeps label and context parts thin over Ark primitives", () => {
  assert.match(labelSource, /<ArkCheckbox\.Label/);
  assert.match(labelSource, /data-slot="checkbox-label"/);
  assert.match(labelSource, /v-bind="\$attrs"/);
  assert.match(contextSource, /<ArkCheckbox\.Context v-slot="context">/);
});

test("forwards the Ark group prop and event contract", () => {
  assert.match(groupSource, /<ArkCheckbox\.Group/);
  assert.match(groupSource, /data-slot="checkbox-group"/);

  for (const prop of [
    "asChild",
    "defaultValue",
    "disabled",
    "invalid",
    "maxSelectedValues",
    "modelValue",
    "name",
    "readOnly",
  ]) {
    assert.match(groupSource, new RegExp(`${prop}: undefined`));
  }

  assert.match(groupSource, /@update:model-value="emit\('update:modelValue', \$event\)"/);
  assert.match(groupSource, /@value-change="emit\('valueChange', \$event\)"/);
  assert.match(typesSource, /valueChange: \[value: string\[\]\]/);
  assert.match(typesSource, /maxSelectedValues\?: ArkCheckboxGroupProps\["maxSelectedValues"\]/);
});

test("exports named parts, the compound API, and Ark hooks", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Group",
    "Control",
    "Indicator",
    "Label",
    "Context",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Checkbox${part}`));
    assert.match(moduleBarrel, new RegExp(`Checkbox${part}`));
  }
  assert.match(moduleBarrel, /CheckboxProps/);
  assert.match(moduleBarrel, /CheckboxEmits/);
  assert.match(moduleBarrel, /CheckboxGroupProps/);
  assert.match(moduleBarrel, /CheckboxCheckedChangeDetails/);
  assert.match(moduleBarrel, /checkboxAnatomy/);
  assert.match(moduleBarrel, /useCheckbox/);
  assert.match(moduleBarrel, /useCheckboxGroup/);
});

test("uses state-attribute-driven Kappa styling", () => {
  assert.match(styles, /\.kappa-checkbox__control \{/);
  assert.match(styles, /inline-size: 1rem/);
  assert.match(styles, /var\(--kappa-radius-sm/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(--kappa-accent-solid/);
  assert.match(styles, /var\(--kappa-accent-contrast/);
  assert.match(styles, /var\(--kappa-danger/);
  assert.match(styles, /var\(--kappa-disabled-opacity/);
  assert.match(styles, /\[data-state="checked"\]/);
  assert.match(styles, /\[data-state="indeterminate"\]/);
  assert.match(styles, /\[data-hover\]/);
  assert.match(styles, /\[data-focus-visible\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /\.kappa-checkbox__indicator\[hidden\] \{\s*display: none/);
  assert.match(styles, /\.kappa-checkbox-group \{/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(
    styles,
    /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/,
  );
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
