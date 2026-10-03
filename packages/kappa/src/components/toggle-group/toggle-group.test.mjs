import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./ToggleGroup.vue");
const providerSource = readSource("./ToggleGroupRootProvider.vue");
const itemSource = readSource("./ToggleGroupItem.vue");
const contextSource = readSource("./ToggleGroupContext.vue");
const typesSource = readSource("./toggle-group.ts");
const styles = readSource("./toggle-group.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the Ark root contract and Kappa visual props", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/toggle-group"/);
  assert.match(rootSource, /<ArkToggleGroup\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="toggle-group"/);

  for (const prop of [
    "asChild",
    "defaultValue",
    "deselectable",
    "disabled",
    "id",
    "ids",
    "loopFocus",
    "modelValue",
    "multiple",
    "orientation",
    "rovingFocus",
    "size",
    "spacing",
    "variant",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: (?:undefined|TOGGLE_GROUP_DEFAULT_)`));
  }

  for (const binding of [
    "as-child",
    "default-value",
    "deselectable",
    "disabled",
    "id",
    "ids",
    "loop-focus",
    "model-value",
    "multiple",
    "orientation",
    "roving-focus",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /@update:model-value="emit\('update:modelValue', \$event\)"/);
  assert.match(rootSource, /@value-change="emit\('valueChange', \$event\)"/);
  assert.match(typesSource, /ToggleGroupSpacing/);
  assert.match(typesSource, /ToggleGroupValueChangeDetails/);
});

test("exposes the provider, item, context, and forwarded item attributes", () => {
  assert.match(providerSource, /<ArkToggleGroup\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(itemSource, /<ArkToggleGroup\.Item/);
  assert.match(itemSource, /v-bind="\$attrs"/);
  assert.match(itemSource, /data-slot="toggle-group-item"/);
  assert.match(itemSource, /:value="props\.value"/);
  assert.match(contextSource, /<ArkToggleGroup\.Context v-slot="context">/);
});

test("exports the compound API and Ark hooks", () => {
  for (const part of ["Root", "RootProvider", "Item", "Context"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: ToggleGroup${part}`));
    assert.match(moduleBarrel, new RegExp(`ToggleGroup${part}`));
  }
  assert.match(moduleBarrel, /ToggleGroupProps/);
  assert.match(moduleBarrel, /toggleGroupAnatomy/);
  assert.match(moduleBarrel, /useToggleGroup/);
  assert.match(moduleBarrel, /useToggleGroupContext/);
});

test("uses semantic tokens, Ark state attributes, and accessible focus states", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-subtle",
    "--kappa-tint",
    "--kappa-disabled-opacity",
  ]) {
    assert.match(styles, new RegExp(`var\\(${token}`));
  }
  for (const selector of [
    "data-state=\"on\"",
    "data-disabled",
    "data-orientation",
    "data-spacing",
    "focus-visible",
    "forced-colors",
    "prefers-reduced-motion",
  ]) {
    assert.match(styles, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(
    styles,
    /--kappa-toggle-group-item-selected-background:\s*var\(--kappa-selected/,
  );
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)/);
});
