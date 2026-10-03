import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { DIRECTION_PROVIDER_DEFAULT_LOCALE } from "./direction-provider.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const component = source("DirectionProvider.vue");
const contracts = source("direction-provider.ts");
const barrel = source("index.ts");

test("uses an explicit left-to-right locale by default", () => {
  assert.equal(DIRECTION_PROVIDER_DEFAULT_LOCALE, "en-US");
});

test("provides Ark UI locale context without adding a DOM root", () => {
  assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(component, /LocaleProvider/);
  assert.match(component, /:locale="props\.locale"/);
  assert.match(component, /<slot \/>/);
  assert.doesNotMatch(component, /<(div|span|section|main)[\s>]/);
});

test("reads direction from the nearest Ark UI locale context", () => {
  assert.match(contracts, /useLocaleContext\(DEFAULT_LOCALE\)/);
  assert.match(contracts, /computed\(\(\) => localeContext\.value\.dir\)/);
  assert.match(contracts, /Direction = "ltr" \| "rtl"/);
});

test("exports the component, composable, and public contracts", () => {
  for (const name of [
    "DirectionProvider",
    "DIRECTION_PROVIDER_DEFAULT_LOCALE",
    "useDirection",
    "Direction",
    "DirectionProviderProps",
    "DirectionProviderSlots",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
