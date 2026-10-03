import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  COMBOBOX_POSITIONING_KEYS,
  getComboboxContentPositioning,
  getComboboxItemDisabled,
  getComboboxItemString,
  getComboboxItemValue,
  matchesComboboxItem,
  mergeComboboxPositioning,
} from "./combobox.ts";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const rootSource = read("./Combobox.vue");
const contentSource = read("./ComboboxContent.vue");
const inputSource = read("./ComboboxInput.vue");
const itemSource = read("./ComboboxItem.vue");
const listSource = read("./ComboboxList.vue");
const multiSource = read("./ComboboxTriggerMultipleWithInput.vue");
const triggerInputSource = read("./ComboboxTriggerInput.vue");
const triggerValueSource = read("./ComboboxTriggerValue.vue");
const styles = `${read("./combobox.css")}\n${read("./combobox-multiple.css")}`;
const moduleBarrel = read("./index.ts");

test("maps primitive and object items without adapters", () => {
  assert.equal(getComboboxItemString("Alpha"), "Alpha");
  assert.equal(getComboboxItemString({ label: "Bravo", value: "b" }), "Bravo");
  assert.equal(getComboboxItemValue({ label: "Bravo", value: "b" }), "b");
  assert.equal(getComboboxItemDisabled({ label: "Charlie", disabled: true }), true);
  assert.equal(getComboboxItemDisabled({ label: "Delta" }), false);
});

test("respects item mapper functions", () => {
  const item = { id: 42, title: "Forty-two", unavailable: true };

  assert.equal(getComboboxItemString(item, (entry) => entry.title), "Forty-two");
  assert.equal(
    getComboboxItemValue(item, (entry) => String(entry.id), (entry) => entry.title),
    "42",
  );
  assert.equal(getComboboxItemDisabled(item, (entry) => entry.unavailable), true);
});

test("normalizes filters and keeps empty-list behavior explicit", () => {
  const calls = [];
  const contains = (value, query) => {
    calls.push([value, query]);
    return true;
  };

  assert.equal(
    matchesComboboxItem({
      contains,
      item: { label: "Café" },
      query: "  cafe  ",
      showOnEmpty: true,
    }),
    true,
  );
  assert.deepEqual(calls, [["Café", "cafe"]]);
  assert.equal(
    matchesComboboxItem({ contains, item: "Alpha", query: "  ", showOnEmpty: false }),
    false,
  );
  assert.equal(
    matchesComboboxItem({
      contains: () => false,
      filter: false,
      item: "Alpha",
      query: "z",
      showOnEmpty: false,
    }),
    true,
  );
});

test("forwards every Ark positioning option from Content to Root", () => {
  assert.equal(COMBOBOX_POSITIONING_KEYS.length, 23);
  assert.deepEqual(
    getComboboxContentPositioning({ flip: false, gutter: 0, sameWidth: true }),
    { flip: false, gutter: 0, sameWidth: true },
  );
  assert.deepEqual(
    mergeComboboxPositioning(
      { gutter: 4, placement: "bottom-start", sameWidth: true },
      { flip: false, gutter: 8 },
    ),
    { flip: false, gutter: 8, placement: "bottom-start", sameWidth: true },
  );
});

test("uses selection-only defaults and forwards root state", () => {
  assert.match(rootSource, /allowCustomValue: false/);
  assert.match(rootSource, /showOnEmpty: true/);
  assert.match(rootSource, /openOnClick: true/);
  assert.match(rootSource, /props\.closeOnSelect \?\? !props\.multiple/);
  assert.match(rootSource, /props\.multiple \? "clear" : "replace"/);
  assert.match(rootSource, /:multiple="multiple"/);
  assert.match(rootSource, /:lazy-mount="lazyMount"/);
  assert.match(rootSource, /:unmount-on-exit="unmountOnExit"/);
  assert.match(rootSource, /@input-value-change="handleInputValueChange"/);
  assert.match(rootSource, /@value-change="handleValueChange"/);
  assert.match(rootSource, /useFilter\(\{ sensitivity: "base", usage: "search" \}\)/);
});

test("uses Ark parts for input, list, item, and indicators", () => {
  assert.match(inputSource, /<Combobox\.Input/);
  assert.match(inputSource, /@keydown\.esc="handleEscape"/);
  assert.match(listSource, /<Combobox\.List/);
  assert.match(itemSource, /<Combobox\.Item/);
  assert.match(itemSource, /<ComboboxItemText>/);
  assert.match(itemSource, /<ComboboxItemIndicator \/>/);
  assert.match(triggerInputSource, /<ComboboxClearTrigger/);
  assert.match(triggerInputSource, /<Combobox\.Trigger/);
});

test("supports select-like and multiple-value controls", () => {
  assert.match(triggerValueSource, /valueAsString/);
  assert.match(triggerValueSource, /selectedItems/);
  assert.match(triggerValueSource, /data-placeholder/);
  assert.match(multiSource, /ComboboxChip v-for="item in selectedItems"/);
  assert.match(multiSource, /<ComboboxInput/);
  assert.match(multiSource, /inputSide/);
});

test("teleports content and synchronizes positioning with Root", () => {
  assert.match(contentSource, /teleport: \{ default: true, type: Boolean \}/);
  assert.match(contentSource, /default: "body"/);
  assert.match(contentSource, /context\.setContentPositioning/);
  assert.match(contentSource, /context\.clearContentPositioning/);
  assert.match(contentSource, /<Teleport/);
  assert.match(contentSource, /<Combobox\.Positioner/);
  assert.match(contentSource, /<Combobox\.Content/);
});

test("exports the full compound surface and Ark hooks", () => {
  for (const part of [
    "Root",
    "Chip",
    "ClearTrigger",
    "Content",
    "Context",
    "Control",
    "Empty",
    "Group",
    "GroupLabel",
    "Input",
    "Item",
    "ItemIndicator",
    "ItemText",
    "Label",
    "List",
    "Separator",
    "Trigger",
    "TriggerInput",
    "TriggerMultipleWithInput",
    "TriggerValue",
    "Value",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Combobox${part}`));
  }
  assert.match(moduleBarrel, /createListCollection as createComboboxCollection/);
  assert.match(moduleBarrel, /useComboboxContext/);
  assert.match(moduleBarrel, /comboboxAnatomy/);
});

test("uses dense, logical, state-driven Kappa styling", () => {
  assert.match(styles, /\.kappa-combobox__content/);
  assert.match(styles, /\.kappa-combobox__multi-control/);
  assert.match(styles, /\.kappa-combobox__chip/);
  assert.match(styles, /\[data-highlighted\]/);
  assert.match(styles, /\[data-state="checked"\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /margin-inline-end/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:reference-width|available-width|available-height|transform-origin)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
});
