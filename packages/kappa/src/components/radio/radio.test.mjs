import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Radio.vue");
const rootProviderSource = readSource("./RadioRootProvider.vue");
const labelSource = readSource("./RadioLabel.vue");
const indicatorSource = readSource("./RadioIndicator.vue");
const itemSource = readSource("./RadioItem.vue");
const itemControlSource = readSource("./RadioItemControl.vue");
const itemTextSource = readSource("./RadioItemText.vue");
const contextSource = readSource("./RadioContext.vue");
const itemContextSource = readSource("./RadioItemContext.vue");
const typesSource = readSource("./radio.ts");
const styles = readSource("./radio.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the Ark root prop and event contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/radio-group"/);
  assert.match(rootSource, /<ArkRadioGroup\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="radio"/);

  for (const prop of [
    "asChild",
    "defaultValue",
    "disabled",
    "dir",
    "form",
    "id",
    "ids",
    "invalid",
    "modelValue",
    "name",
    "orientation",
    "readOnly",
    "required",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const binding of [
    "as-child",
    "default-value",
    "disabled",
    "form",
    "id",
    "ids",
    "invalid",
    "model-value",
    "name",
    "orientation",
    "read-only",
    "required",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /@update:model-value="emit\('update:modelValue', \$event\)"/);
  assert.match(rootSource, /@value-change="emit\('valueChange', \$event\)"/);
  assert.match(rootSource, /<LocaleProvider :locale="locale">/);
  assert.match(typesSource, /RadioDirection = "ltr" \| "rtl"/);
  assert.match(typesSource, /"update:modelValue": \[value: string \| null\]/);
});

test("renders the required native input inside every item", () => {
  assert.match(itemSource, /<ArkRadioGroup\.Item/);
  assert.match(itemSource, /<ArkRadioGroup\.ItemHiddenInput/);
  assert.match(itemSource, /data-slot="radio-item-hidden-input"/);
  assert.match(itemSource, /:aria-errormessage="fieldErrorMessageId"/);
  assert.match(typesSource, /intentionally omits Ark UI's `asChild`/);
  assert.doesNotMatch(typesSource, /interface RadioItemProps[\s\S]*?asChild/);
});

test("provides the complete styled and renderless part set", () => {
  assert.match(rootProviderSource, /<ArkRadioGroup\.RootProvider/);
  assert.match(labelSource, /<ArkRadioGroup\.Label/);
  assert.match(labelSource, /data-slot="radio-label"/);
  assert.match(indicatorSource, /<ArkRadioGroup\.Indicator/);
  assert.match(indicatorSource, /data-slot="radio-indicator"/);
  assert.match(itemControlSource, /<ArkRadioGroup\.ItemControl/);
  assert.match(itemControlSource, /data-slot="radio-item-control"/);
  assert.match(itemControlSource, /<slot><span class="kappa-radio__dot"/);
  assert.match(itemTextSource, /<ArkRadioGroup\.ItemText/);
  assert.match(itemTextSource, /data-slot="radio-item-text"/);
  assert.match(contextSource, /<ArkRadioGroup\.Context v-slot="context">/);
  assert.match(itemContextSource, /<ArkRadioGroup\.ItemContext v-slot="context">/);
});

test("exports the compound API, named parts, and Ark hooks", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Label",
    "Indicator",
    "Item",
    "ItemControl",
    "ItemText",
    "Context",
    "ItemContext",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Radio${part}`));
    assert.match(moduleBarrel, new RegExp(`Radio${part}`));
  }
  assert.match(moduleBarrel, /RadioProps/);
  assert.match(moduleBarrel, /RadioGroupValueChangeDetails/);
  assert.match(moduleBarrel, /radioGroupAnatomy/);
  assert.match(moduleBarrel, /useRadioGroup/);
  assert.match(moduleBarrel, /useRadioGroupContext/);
  assert.match(moduleBarrel, /useRadioGroupItemContext/);
});

test("uses Ark state attributes, semantic tokens, and logical layout", () => {
  assert.match(styles, /\.kappa-radio__item-control \{/);
  assert.match(styles, /\.kappa-radio__dot \{/);
  assert.match(styles, /\.kappa-radio__indicator \{/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(--kappa-accent-solid/);
  assert.match(styles, /var\(--kappa-accent-contrast/);
  assert.match(styles, /var\(--kappa-danger/);
  assert.match(styles, /var\(--kappa-disabled-opacity/);
  assert.match(styles, /\[data-state="checked"\]/);
  assert.match(styles, /\[data-hover\]/);
  assert.match(styles, /\[data-focus-visible\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /margin-block-start/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:width|height|transition-property)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(
    styles,
    /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/,
  );
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
