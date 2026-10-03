import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  createCommandPaletteSegments,
  getCommandPaletteItemValue,
  matchesCommandPaletteItem,
  stringifyCommandPaletteItem,
} from "./command-palette.ts";

const rootSource = readFileSync(new URL("./CommandPaletteRoot.vue", import.meta.url), "utf8");
const dialogSource = readFileSync(new URL("./CommandPaletteDialog.vue", import.meta.url), "utf8");
const panelSource = readFileSync(new URL("./CommandPalettePanel.vue", import.meta.url), "utf8");
const inputSource = readFileSync(new URL("./CommandPaletteInput.vue", import.meta.url), "utf8");
const itemSource = readFileSync(new URL("./CommandPaletteItem.vue", import.meta.url), "utf8");
const styles = readFileSync(new URL("./command-palette.css", import.meta.url), "utf8");
const barrel = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

test("maps command labels and stable values", () => {
  assert.equal(stringifyCommandPaletteItem("Run"), "Run");
  assert.equal(stringifyCommandPaletteItem({ title: "Run solver", id: "run" }), "Run solver");
  assert.equal(stringifyCommandPaletteItem({ label: "Open mesh" }), "Open mesh");
  assert.equal(getCommandPaletteItemValue({ title: "Run solver", id: "run" }), "run");
  assert.equal(getCommandPaletteItemValue({ label: "Open mesh", value: "mesh" }), "mesh");
});

test("supports normalized default and custom filtering", () => {
  assert.equal(
    matchesCommandPaletteItem({ item: { label: "Review mesh" }, query: "  MESH  " }),
    true,
  );
  assert.equal(
    matchesCommandPaletteItem({ item: { label: "Run solver" }, query: "mesh" }),
    false,
  );

  let receivedQuery = "";
  assert.equal(
    matchesCommandPaletteItem({
      filter: (_item, query) => {
        receivedQuery = query;
        return true;
      },
      item: "Run solver",
      query: "  run ",
    }),
    true,
  );
  assert.equal(receivedQuery, "run");
  assert.equal(matchesCommandPaletteItem({ filter: false, item: "Run", query: "none" }), true);
});

test("preserves the default filter when the false sentinel prop is absent", () => {
  assert.match(rootSource, /filter: undefined/);
  assert.match(panelSource, /filter: undefined/);
});

test("merges and clamps highlighted text ranges", () => {
  assert.deepEqual(createCommandPaletteSegments("Command Palette", [[0, 2], [2, 6], [99, 100]]), [
    { highlighted: true, text: "Command" },
    { highlighted: false, text: " Palette" },
  ]);
  assert.deepEqual(createCommandPaletteSegments("Search"), [
    { highlighted: false, text: "Search" },
  ]);
});

test("composes Ark UI dialog and combobox behavior", () => {
  assert.match(dialogSource, /from "@ark-ui\/vue\/dialog"/);
  assert.match(dialogSource, /:initial-focus-el="getInitialFocus"/);
  assert.match(dialogSource, /:final-focus-el="getFinalFocus"/);
  assert.match(dialogSource, /:restore-focus="props\.restoreFocus"/);
  assert.match(dialogSource, /:trap-focus="props\.trapFocus"/);
  assert.match(panelSource, /from "@ark-ui\/vue\/combobox"/);
  assert.match(panelSource, /:loop-focus="true"/);
  assert.match(panelSource, /input-behavior="autohighlight"/);
  assert.match(panelSource, /const firstItem = selectableItems\.value\.find/);
  assert.match(rootSource, /const hasOpenProp/);
  assert.match(rootSource, /const hasValueProp/);
  assert.match(rootSource, /v-bind="panelBindings"/);
  assert.doesNotMatch(rootSource, /:value="value"/);
});

test("keeps Enter selection exact and supports modified activation", () => {
  assert.match(inputSource, /event\.key === "Enter"/);
  assert.doesNotMatch(inputSource, /event\.defaultPrevented/);
  assert.match(inputSource, /newTab: event\.metaKey \|\| event\.ctrlKey/);
  assert.match(inputSource, /aria-label="Close command palette"/);
  assert.match(itemSource, /event\.stopImmediatePropagation\(\)/);
  assert.match(itemSource, /newTab: true/);
});

test("exports the full compound surface", () => {
  for (const part of [
    "Dialog",
    "Empty",
    "Footer",
    "Group",
    "GroupLabel",
    "HighlightedText",
    "Input",
    "Item",
    "Items",
    "List",
    "Loading",
    "Panel",
    "ResultItem",
    "Results",
    "Root",
  ]) {
    assert.match(barrel, new RegExp(`${part}: CommandPalette${part}`));
  }
});

test("uses semantic Kappa tokens and complete motion fallbacks", () => {
  for (const token of ["--kappa-control", "--kappa-default", "--kappa-focus", "--kappa-line"]) {
    assert.match(styles, new RegExp(`var\\(${token}`));
  }
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
