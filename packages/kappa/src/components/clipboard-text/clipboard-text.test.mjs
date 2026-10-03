import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./ClipboardText.vue");
const rootProviderSource = readSource("./ClipboardTextRootProvider.vue");
const triggerSource = readSource("./ClipboardTextTrigger.vue");
const indicatorSource = readSource("./ClipboardTextIndicator.vue");
const inputSource = readSource("./ClipboardTextInput.vue");
const typesSource = readSource("./clipboard-text.ts");
const styles = readSource("./clipboard-text.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the exact Ark root prop and event contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/clipboard"/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="clipboard-text"/);

  for (const prop of [
    "asChild",
    "defaultValue",
    "id",
    "ids",
    "modelValue",
    "timeout",
    "translations",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const binding of ["default-value", "id", "ids", "model-value", "timeout", "translations"]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /@status-change="emit\('statusChange', \$event\)"/);
  assert.match(rootSource, /@update:model-value="emit\('update:modelValue', \$event\)"/);
  assert.match(rootSource, /@value-change="emit\('valueChange', \$event\)"/);
  assert.match(typesSource, /"update:modelValue": \[value: string\]/);
  assert.match(typesSource, /statusChange: \[details: ClipboardCopyStatusDetails\]/);
});

test("swaps trigger icons through the copied indicator slots", () => {
  assert.match(triggerSource, /<ClipboardTextIndicator>/);
  assert.match(triggerSource, /<template #copied>/);
  assert.equal((triggerSource.match(/<svg/g) ?? []).length, 2);
  assert.match(triggerSource, /kappa-clipboard-text__icon--copied/);

  assert.match(indicatorSource, /<template #default>/);
  assert.match(indicatorSource, /<template #copied>/);
  assert.match(indicatorSource, /<slot name="copied" \/>/);
  assert.match(typesSource, /copied\?: \(\) => VNodeChild/);
});

test("keeps the read-only value input and provider parts thin", () => {
  assert.match(inputSource, /<ArkClipboard\.Input/);
  assert.match(inputSource, /data-slot="clipboard-text-input"/);
  assert.match(inputSource, /v-bind="\$attrs"/);
  assert.match(rootProviderSource, /<ArkClipboard\.RootProvider/);
  assert.match(rootProviderSource, /:value="value"/);
});

test("exports named parts, the compound API, and Ark hooks", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Label",
    "Control",
    "Input",
    "Trigger",
    "Indicator",
    "ValueText",
    "Context",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: ClipboardText${part}`));
    assert.match(moduleBarrel, new RegExp(`ClipboardText${part}`));
  }
  assert.match(moduleBarrel, /ClipboardTextProps/);
  assert.match(moduleBarrel, /ClipboardTextEmits/);
  assert.match(moduleBarrel, /ClipboardCopyStatusDetails/);
  assert.match(moduleBarrel, /clipboardAnatomy/);
  assert.match(moduleBarrel, /useClipboard/);
});

test("uses state-attribute-driven Kappa styling", () => {
  assert.match(styles, /\.kappa-clipboard-text__control \{/);
  assert.match(styles, /min-block-size: 2rem/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(--kappa-focus/);
  assert.match(styles, /var\(--kappa-font-mono/);
  assert.match(styles, /var\(--kappa-success-solid/);
  assert.match(styles, /\[data-copied\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /:focus-within/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(
    styles,
    /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/,
  );
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
