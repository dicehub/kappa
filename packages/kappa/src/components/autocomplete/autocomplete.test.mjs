import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  getAutocompleteItemString,
  getAutocompleteItemValue,
  matchesAutocompleteItem,
} from "./autocomplete.ts";

const rootSource = readFileSync(new URL("./Autocomplete.vue", import.meta.url), "utf8");
const contentSource = readFileSync(new URL("./AutocompleteContent.vue", import.meta.url), "utf8");
const inputGroupSource = readFileSync(new URL("./AutocompleteInputGroup.vue", import.meta.url), "utf8");
const itemSource = readFileSync(new URL("./AutocompleteItem.vue", import.meta.url), "utf8");
const listSource = readFileSync(new URL("./AutocompleteList.vue", import.meta.url), "utf8");
const styles = readFileSync(new URL("./autocomplete.css", import.meta.url), "utf8");
const moduleBarrel = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

test("maps primitive and object item labels and values", () => {
  assert.equal(getAutocompleteItemString("Alpha"), "Alpha");
  assert.equal(getAutocompleteItemString({ label: "Bravo", value: "b" }), "Bravo");
  assert.equal(getAutocompleteItemValue({ label: "Bravo", value: "b" }), "b");
  assert.equal(getAutocompleteItemValue({ label: "Charlie", value: undefined }), "Charlie");
  assert.equal(getAutocompleteItemValue({ label: "Delta", value: null }), "Delta");
});

test("respects explicit item mappers", () => {
  const item = { id: 42, title: "Forty-two" };

  assert.equal(getAutocompleteItemString(item, (entry) => entry.title), "Forty-two");
  assert.equal(
    getAutocompleteItemValue(
      item,
      (entry) => String(entry.id),
      (entry) => entry.title,
    ),
    "42",
  );
});

test("treats whitespace-only input as empty", () => {
  const base = {
    contains: () => true,
    inputValue: " \t ",
    item: "Alpha",
  };

  assert.equal(matchesAutocompleteItem({ ...base, showOnEmpty: false }), false);
  assert.equal(matchesAutocompleteItem({ ...base, showOnEmpty: true }), true);
});

test("normalizes the query and delegates locale-aware matching", () => {
  const calls = [];
  const matches = matchesAutocompleteItem({
    contains: (value, query) => {
      calls.push([value, query]);
      return true;
    },
    inputValue: "  cafe  ",
    item: { label: "Café" },
    showOnEmpty: false,
  });

  assert.equal(matches, true);
  assert.deepEqual(calls, [["Café", "cafe"]]);
});

test("supports disabled filtering and normalized custom filters", () => {
  let query;
  const item = { label: "Echo" };

  assert.equal(
    matchesAutocompleteItem({
      contains: () => false,
      filter: (_item, value) => {
        query = value;
        return true;
      },
      inputValue: " echo ",
      item,
      showOnEmpty: false,
    }),
    true,
  );
  assert.equal(query, "echo");
  assert.equal(
    matchesAutocompleteItem({
      contains: () => false,
      filter: false,
      inputValue: "echo",
      item,
      showOnEmpty: false,
    }),
    true,
  );
});

test("uses Ark public APIs and forwards the controlled root contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/locale"/);
  assert.match(rootSource, /useFilter\(\{ sensitivity: "base", usage: "search" \}\)/);
  for (const prop of ["filter", "open", "openOnChange", "openOnKeyPress"]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }
  assert.match(rootSource, /isItemDisabled: props\.isItemDisabled/);
  assert.match(
    rootSource,
    /valueToInputValue\(props\.modelValue \?\? props\.defaultValue\)/,
  );
  assert.match(rootSource, /internalFilterValue = ref\(props\.inputValue \?\? props\.defaultInputValue \?\? ""\)/);
  assert.match(rootSource, /:default-input-value="resolvedDefaultInputValue"/);
  assert.match(rootSource, /:input-value="resolvedInputValue"/);
  assert.match(rootSource, /:input-behavior="inputBehavior"/);
  assert.match(rootSource, /:as-child="asChild"/);
  assert.match(rootSource, /:lazy-mount="lazyMount"/);
  assert.match(rootSource, /:unmount-on-exit="unmountOnExit"/);
  assert.match(rootSource, /@input-value-change="handleInputValueChange"/);
  assert.match(rootSource, /@update:input-value="emit\('update:inputValue', \$event\)"/);
  assert.match(rootSource, /:input-attrs="inputAttrs"/);
});

test("renders a native list and a composable selected indicator", () => {
  assert.match(listSource, /<Combobox\.List/);
  assert.doesNotMatch(listSource, /getListProps/);
  assert.match(listSource, /<slot v-else \/>/);
  assert.match(itemSource, /<slot name="indicator">/);
  assert.match(itemSource, /<AutocompleteItemIndicator \/>/);
});

test("teleports content by default with an opt-out and custom target", () => {
  assert.match(contentSource, /teleport: true/);
  assert.match(contentSource, /teleportTo: "body"/);
  assert.match(contentSource, /const isMounted = ref\(false\)/);
  assert.match(contentSource, /onMounted\(\(\) => \{/);
  assert.match(contentSource, /<Teleport :disabled="!teleport \|\| !isMounted" :to="teleportTo">/);
});

test("keeps native input defaults overridable and the free-form clear trigger visible", () => {
  assert.match(inputGroupSource, /autocomplete: "off"/);
  assert.match(inputGroupSource, /autocapitalize: "none"/);
  assert.match(inputGroupSource, /autocorrect: "off"/);
  assert.match(inputGroupSource, /spellcheck: false/);
  assert.match(inputGroupSource, /\.\.\.attrs,\s+\.\.\.props\.inputAttrs/);
  assert.match(inputGroupSource, /combobox\.value\.setOpen\(false, "escape-key"\)/);
  assert.match(inputGroupSource, /@keydown\.esc="handleEscape"/);
  assert.match(inputGroupSource, /v-if="clearable && hasInputValue"/);
  assert.match(inputGroupSource, /:hidden="false"/);
});

test("covers responsive, directional, state, and motion styling", () => {
  assert.match(styles, /\.kappa-autocomplete__content/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:reference-width|available-width|available-height|transform-origin)(?![\w-]))[a-z][\w-]*/);
  assert.match(styles, /max-inline-size: min\(var\(--available-width/);
  assert.match(styles, /margin-inline-end/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-state="checked"\]/);
  assert.match(styles, /\.kappa-autocomplete__item-indicator\[hidden\]/);
  assert.match(styles, /font-size: 1rem/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test("exports the full compound surface", () => {
  for (const part of [
    "Content",
    "Empty",
    "Group",
    "GroupLabel",
    "InputGroup",
    "Item",
    "ItemIndicator",
    "ItemText",
    "Label",
    "List",
    "Root",
    "Separator",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Autocomplete${part}`));
  }
  assert.match(moduleBarrel, /createListCollection as createAutocompleteCollection/);
  assert.match(moduleBarrel, /useListCollection as useAutocompleteCollection/);
});
