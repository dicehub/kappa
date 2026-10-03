import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  FORMAT_DEFAULT_LOCALE,
  resolveFormatLocale,
  resolveFormatRelativeTimeStyle,
} from "./format.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const root = source("Format.vue");
const byte = source("FormatByte.vue");
const number = source("FormatNumber.vue");
const relativeTime = source("FormatRelativeTime.vue");
const time = source("FormatTime.vue");
const styles = source("format.css");
const contracts = source("format.ts");
const barrel = source("index.ts");

test("resolves a safe locale for Intl formatters", () => {
  assert.equal(FORMAT_DEFAULT_LOCALE, "en-US");
  assert.equal(resolveFormatLocale(undefined), "en-US");
  assert.equal(resolveFormatLocale("  de-DE  "), "de-DE");
  assert.equal(resolveFormatLocale("de-de"), "de-DE");
  assert.equal(resolveFormatLocale("invalid_locale"), "en-US");
  assert.equal(resolveFormatLocale(""), "en-US");
  assert.equal(resolveFormatLocale("   "), "en-US");
  assert.equal(resolveFormatLocale(null), "en-US");
});

test("accepts only supported relative-time styles", () => {
  for (const style of ["long", "short", "narrow"]) {
    assert.equal(resolveFormatRelativeTimeStyle(style), style);
  }
  for (const invalid of [{}, "", "wide", null]) {
    assert.equal(resolveFormatRelativeTimeStyle(invalid), undefined);
  }
});

test("provides locale context without adding a root element", () => {
  assert.match(root, /LocaleProvider/);
  assert.match(root, /defineOptions\(\{ inheritAttrs: false \}\)/);
  assert.match(root, /FORMAT_DEFAULT_LOCALE/);
  assert.match(root, /<slot \/>/);
});

test("forwards only supported Ark format props and consumer attributes", () => {
  for (const component of [byte, number, relativeTime, time]) {
    assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/);
    assert.match(component, /v-bind="\$attrs"/);
    assert.match(component, /LocaleProvider/);
    assert.doesNotMatch(component, /v-bind="props"/);
    assert.doesNotMatch(component, /@zag-js/);
  }

  assert.match(byte, /:unit="props\.unit"/);
  assert.match(byte, /:unit-system="props\.unitSystem"/);
  assert.match(number, /:notation="props\.notation"/);
  assert.match(number, /:sign-display="props\.signDisplay"/);
  assert.match(relativeTime, /:locale-matcher="props\.localeMatcher"/);
  assert.match(relativeTime, /:numeric="props\.numeric"/);
  assert.match(relativeTime, /:style="resolvedStyle"/);
  assert.match(relativeTime, /resolveFormatRelativeTimeStyle/);
  assert.match(time, /:with-seconds="props\.withSeconds"/);
});

test("declares every forwarded option as a runtime-visible Vue prop", () => {
  for (const prop of [
    "unit",
    "unitDisplay",
    "unitSystem",
    "compactDisplay",
    "currencyDisplay",
    "currencySign",
    "notation",
    "signDisplay",
    "localeMatcher",
    "numeric",
    "style",
    "amLabel",
    "format",
    "pmLabel",
    "withSeconds",
  ]) {
    assert.match(contracts, new RegExp(`${prop}\\?:`));
  }
  assert.doesNotMatch(contracts, /extends Omit</);
});

test("uses semantic styling and stable data slots", () => {
  assert.match(styles, /var\(--kappa-default/);
  assert.match(styles, /var\(--kappa-subtle/);
  assert.match(styles, /font-variant-numeric: tabular-nums/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  const slotFiles = {
    "format-byte": "FormatByte.vue",
    "format-number": "FormatNumber.vue",
    "format-relative-time": "FormatRelativeTime.vue",
    "format-time": "FormatTime.vue",
  };
  for (const [slot, file] of Object.entries(slotFiles)) {
    assert.match(source(file), new RegExp(`data-slot="${slot}"`));
  }
});

test("exports the compound root, named parts, and public prop contracts", () => {
  for (const name of [
    "Format",
    "FormatRoot",
    "FormatByte",
    "FormatNumber",
    "FormatRelativeTime",
    "FormatTime",
    "FormatProps",
    "FormatByteProps",
    "FormatNumberProps",
    "FormatRelativeTimeProps",
    "FormatRelativeTimeStyle",
    "FormatTimeProps",
    "FORMAT_DEFAULT_LOCALE",
    "resolveFormatLocale",
    "resolveFormatRelativeTimeStyle",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
