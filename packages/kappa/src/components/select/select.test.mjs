import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  getSelectContentLabel,
  getSelectItemDisabled,
  getSelectItemString,
  getSelectItemValue,
} from "./select.ts";
import { resolveSelectItemAlignmentOffset } from "./select-positioning.ts";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const rootSource = read("./Select.vue");
const itemSource = read("./SelectItem.vue");
const indicatorSource = read("./SelectIndicator.vue");
const listSource = read("./SelectList.vue");
const positionerSource = read("./SelectPositioner.vue");
const positioningSource = read("./select-positioning.ts");
const triggerSource = read("./SelectTrigger.vue");
const valueSource = read("./SelectValueText.vue");
const rootProviderSource = read("./SelectRootProvider.vue");
const styles = read("./select.css");
const moduleBarrel = read("./index.ts");
const packageJson = JSON.parse(readFileSync(new URL("../../../package.json", import.meta.url), "utf8"));

test("maps primitive and object items without adapters", () => {
  assert.equal(getSelectItemString("Alpha"), "Alpha");
  assert.equal(getSelectItemString({ label: "Bravo", value: "b" }), "Bravo");
  assert.equal(getSelectItemValue({ label: "Bravo", value: "b" }), "b");
  assert.equal(getSelectItemDisabled({ label: "Charlie", disabled: true }), true);
  assert.equal(getSelectItemDisabled({ label: "Delta" }), false);
  assert.equal(getSelectContentLabel("active"), "active");
  assert.equal(getSelectContentLabel(""), "Select an option");
});

test("respects item mapper functions", () => {
  const item = { id: 42, title: "Forty-two", unavailable: true };

  assert.equal(getSelectItemString(item, (entry) => entry.title), "Forty-two");
  assert.equal(
    getSelectItemValue(item, (entry) => String(entry.id), (entry) => entry.title),
    "42",
  );
  assert.equal(getSelectItemDisabled(item, (entry) => entry.unavailable), true);
});

test("aligns the selected item only when the popup remains in the viewport", () => {
  assert.equal(
    resolveSelectItemAlignmentOffset({
      floatingHeight: 256,
      floatingTop: 400,
      overflowPadding: 8,
      selectedCenter: 528,
      triggerCenter: 500,
      viewportHeight: 900,
    }),
    -28,
  );
  assert.equal(
    resolveSelectItemAlignmentOffset({
      floatingHeight: 256,
      floatingTop: 20,
      overflowPadding: 8,
      selectedCenter: 180,
      triggerCenter: 40,
      viewportHeight: 900,
    }),
    undefined,
  );
});

test("keeps Ark collection and state semantics at the root", () => {
  assert.match(rootSource, /createListCollection/);
  assert.match(rootSource, /:collection="collection"/);
  assert.match(rootSource, /:model-value="modelValue"/);
  assert.match(rootSource, /:multiple="multiple"/);
  assert.match(rootSource, /:positioning="resolvedPositioning"/);
  assert.match(rootSource, /\.\.\.defaultPositioning/);
  assert.match(rootSource, /withSelectItemAlignment/);
  assert.match(rootSource, /:read-only="readOnly"/);
  assert.match(rootSource, /:required="required"/);
  assert.match(rootSource, /<LocaleProvider/);
  assert.match(rootSource, /useId/);
  assert.doesNotMatch(rootSource, /__kappaSelectId/);
  assert.match(rootSource, /<SelectHiddenSelect \/>/);
});

test("supports compound options, collection rendering, and teleport positioning", () => {
  assert.match(itemSource, /<ArkSelect\.Item/);
  assert.match(itemSource, /<SelectItemText>/);
  assert.match(itemSource, /<SelectItemIndicator \/>/);
  assert.match(listSource, /<ArkSelect\.List/);
  assert.match(listSource, /renderItems/);
  assert.match(positionerSource, /<Teleport/);
  assert.match(positionerSource, /<ArkSelect\.Positioner/);
  assert.match(positioningSource, /data-item-alignment/);
  assert.equal((indicatorSource.match(/<path /g) ?? []).length, 2);
  assert.match(triggerSource, /aria-describedby/);
  assert.match(valueSource, /displayValue/);
  assert.match(rootProviderSource, /@exit-complete/);
});

test("exports the compound surface, Option alias, and Ark hooks", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Trigger",
    "ValueText",
    "Indicator",
    "ClearTrigger",
    "Control",
    "Content",
    "Label",
    "Positioner",
    "List",
    "Item",
    "Option",
    "ItemText",
    "ItemIndicator",
    "Group",
    "GroupLabel",
    "Separator",
    "HiddenSelect",
    "Context",
    "ItemContext",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Select${part}`));
  }
  assert.match(moduleBarrel, /createListCollection as createSelectCollection/);
  assert.match(moduleBarrel, /useSelectContext/);
  assert.match(moduleBarrel, /selectAnatomy/);
  assert.match(moduleBarrel, /SelectSelectionDetails/);
  assert.equal(packageJson.exports["./components/*"]["kappa-source"], "./src/components/*/index.ts");
  assert.equal(packageJson.exports["./components/*"].import, "./dist/components/*.js");
});

test("uses logical, state-driven Kappa styling", () => {
  assert.match(styles, /--kappa-select-trigger-radius: 0\.125rem/);
  assert.match(styles, /border-radius: var\(--kappa-select-trigger-radius\)/);
  assert.equal((styles.match(/border-radius: var\(--kappa-select-trigger-radius\)/g) ?? []).length, 1);
  assert.match(styles, /\.kappa-select__content/);
  assert.match(styles, /\[data-highlighted\]/);
  assert.match(styles, /\[data-state="checked"\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /margin-inline/);
  assert.match(styles, /aria-orientation="vertical"/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:z-index|reference-width|available-width|available-height|transform-origin)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /indicator\[data-state="open"\]/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
});
