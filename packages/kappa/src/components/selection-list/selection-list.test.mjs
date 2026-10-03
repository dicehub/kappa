import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const root = readSource("./SelectionList.vue");
const provider = readSource("./SelectionListRootProvider.vue");
const styles = readSource("./selection-list.css");
const types = readSource("./selection-list.ts");
const barrel = readSource("./index.ts");

const arkParts = [
  ["Label", "selection-list-label"],
  ["Input", "selection-list-input"],
  ["Content", "selection-list-content"],
  ["Empty", "selection-list-empty"],
  ["ItemGroup", "selection-list-item-group"],
  ["ItemGroupLabel", "selection-list-item-group-label"],
  ["Item", "selection-list-item"],
  ["ItemText", "selection-list-item-text"],
  ["ItemIndicator", "selection-list-item-indicator"],
  ["ValueText", "selection-list-value-text"],
];

const layoutParts = [
  ["ItemMedia", "selection-list-item-media"],
  ["ItemContent", "selection-list-item-content"],
  ["ItemDescription", "selection-list-item-description"],
  ["ItemMeta", "selection-list-item-meta"],
];

test("forwards the Ark Listbox root state and events", () => {
  assert.match(root, /from "@ark-ui\/vue\/listbox"/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="selection-list"/);

  for (const prop of [
    "collection",
    "defaultHighlightedValue",
    "defaultValue",
    "deselectable",
    "disabled",
    "disallowSelectAll",
    "highlightedValue",
    "loopFocus",
    "modelValue",
    "orientation",
    "scrollToIndexFn",
    "selectOnHighlight",
    "selectionMode",
    "typeahead",
  ]) {
    assert.match(root, new RegExp(`props\\.${prop}`));
  }

  for (const event of [
    "highlightChange",
    "select",
    "valueChange",
    "update:highlightedValue",
    "update:modelValue",
  ]) {
    assert.match(types, new RegExp(`(?:\\"|)${event.replace(":", "\\:")}`));
  }
});

test("wraps every Ark part and exposes rich item layout parts", () => {
  for (const [part, slot] of arkParts) {
    const source = readSource(`./SelectionList${part}.vue`);
    assert.match(source, new RegExp(`<ArkListbox\\.${part}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
  }

  for (const [part, slot] of layoutParts) {
    const source = readSource(`./SelectionList${part}.vue`);
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
  }
});

test("supports external machines, contexts, helpers, and both import styles", () => {
  assert.match(provider, /<ArkListbox\.RootProvider/);
  assert.match(provider, /:value="props\.value"/);
  assert.match(readSource("./SelectionListContext.vue"), /<ArkListbox\.Context/);
  assert.match(readSource("./SelectionListItemContext.vue"), /<ArkListbox\.ItemContext/);
  assert.match(barrel, /createListCollection as createSelectionListCollection/);
  assert.match(barrel, /useListbox as useSelectionList/);
  assert.match(barrel, /listboxAnatomy as selectionListAnatomy/);

  for (const part of [
    "Root",
    "RootProvider",
    ...arkParts.map(([name]) => name),
    ...layoutParts.map(([name]) => name),
    "Context",
    "ItemContext",
  ]) {
    assert.match(barrel, new RegExp(`${part}: SelectionList${part}`));
  }
});

test("provides dense sizes and useful selected, focus, disabled, and empty states", () => {
  assert.match(types, /SELECTION_LIST_SIZES = \["sm", "base"\]/);
  assert.match(styles, /\[data-size="sm"\]/);
  assert.match(styles, /\[data-selected\]/);
  assert.match(styles, /\[data-focus-visible\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /kappa-selection-list__empty/);
  assert.match(styles, /kappa-selection-list__item-indicator\[hidden\]/);
  assert.match(readSource("./SelectionListItemIndicator.vue"), /<slot><svg/);
});

test("uses namespaced semantic styling and logical properties", () => {
  assert.match(styles, /var\(--kappa-default/);
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /var\(--kappa-focus/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
