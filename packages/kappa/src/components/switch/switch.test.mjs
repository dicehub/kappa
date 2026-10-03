import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Switch.vue");
const rootProviderSource = readSource("./SwitchRootProvider.vue");
const controlSource = readSource("./SwitchControl.vue");
const thumbSource = readSource("./SwitchThumb.vue");
const labelSource = readSource("./SwitchLabel.vue");
const contextSource = readSource("./SwitchContext.vue");
const typesSource = readSource("./switch.ts");
const styles = readSource("./switch.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the Ark root prop and event contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/switch"/);
  assert.match(rootSource, /<ArkSwitch\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="switch"/);

  for (const prop of [
    "asChild",
    "checked",
    "defaultChecked",
    "disabled",
    "dir",
    "form",
    "id",
    "ids",
    "invalid",
    "label",
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
    "label",
    "name",
    "read-only",
    "required",
    "value",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /@checked-change="emit\('checkedChange', \$event\)"/);
  assert.match(rootSource, /@update:checked="emit\('update:checked', \$event\)"/);
  assert.match(rootSource, /<LocaleProvider :locale="locale">/);
  assert.match(typesSource, /SwitchDirection = "ltr" \| "rtl"/);
  assert.match(typesSource, /"update:checked": \[checked: boolean\]/);
});

test("renders one automatic hidden input for native forms", () => {
  assert.equal((rootSource.match(/<ArkSwitch\.HiddenInput/g) ?? []).length, 1);
  assert.equal((rootProviderSource.match(/<ArkSwitch\.HiddenInput/g) ?? []).length, 1);
  assert.match(rootSource, /data-slot="switch-hidden-input"/);
  assert.match(rootProviderSource, /data-slot="switch-hidden-input"/);
  assert.match(rootSource, /:aria-errormessage="fieldErrorMessageId"/);
  assert.match(rootProviderSource, /:aria-errormessage="fieldErrorMessageId"/);
});

test("provides thin styled parts and a default thumb", () => {
  assert.match(controlSource, /<ArkSwitch\.Control/);
  assert.match(controlSource, /data-slot="switch-control"/);
  assert.match(controlSource, /<slot><SwitchThumb \/><\/slot>/);
  assert.match(thumbSource, /<ArkSwitch\.Thumb/);
  assert.match(thumbSource, /data-slot="switch-thumb"/);
  assert.match(labelSource, /<ArkSwitch\.Label/);
  assert.match(labelSource, /data-slot="switch-label"/);
  assert.match(contextSource, /<ArkSwitch\.Context v-slot="context">/);
});

test("resolves the compact size contract", () => {
  assert.match(typesSource, /SWITCH_SIZES = \["sm", "base", "lg"\] as const/);
  assert.match(typesSource, /SWITCH_DEFAULT_SIZE = "base"/);
  assert.match(typesSource, /resolveSwitchSize/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.match(rootProviderSource, /:data-size="resolvedSize"/);
});

test("exports the compound API, named parts, and Ark hooks", () => {
  for (const part of ["Root", "RootProvider", "Control", "Thumb", "Label", "Context"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Switch${part}`));
    assert.match(moduleBarrel, new RegExp(`Switch${part}`));
  }
  assert.match(moduleBarrel, /SwitchProps/);
  assert.match(moduleBarrel, /SwitchDirection/);
  assert.match(moduleBarrel, /SwitchCheckedChangeDetails/);
  assert.match(moduleBarrel, /switchAnatomy/);
  assert.match(moduleBarrel, /useSwitch/);
  assert.match(moduleBarrel, /useSwitchContext/);
});

test("uses state attributes, semantic tokens, and logical motion", () => {
  assert.match(styles, /\.kappa-switch__control \{/);
  assert.match(styles, /\.kappa-switch__thumb \{/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(--kappa-accent-solid/);
  assert.match(styles, /var\(--kappa-accent-contrast/);
  assert.match(styles, /var\(--kappa-danger/);
  assert.match(styles, /var\(--kappa-disabled-opacity/);
  assert.match(styles, /\[data-state="checked"\]/);
  assert.match(styles, /\[data-hover\]/);
  assert.match(styles, /\[data-active\]/);
  assert.match(styles, /\[data-focus-visible\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /inset-inline-start/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(
    styles,
    /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/,
  );
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
