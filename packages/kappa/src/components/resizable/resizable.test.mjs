import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  RESIZABLE_DEFAULT_ORIENTATION,
  RESIZABLE_ORIENTATIONS,
  isResizableOrientation,
  resolveResizableOrientation,
} from "./resizable.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const root = source("Resizable.vue");
const provider = source("ResizableRootProvider.vue");
const panel = source("ResizablePanel.vue");
const trigger = source("ResizableResizeTrigger.vue");
const handle = source("ResizableHandle.vue");
const indicator = source("ResizableResizeTriggerIndicator.vue");
const context = source("ResizableContext.vue");
const types = source("resizable.ts");
const styles = source("resizable.css");
const barrel = source("index.ts");

test("defines the horizontal default and a safe orientation contract", () => {
  assert.deepEqual(RESIZABLE_ORIENTATIONS, ["horizontal", "vertical"]);
  assert.equal(RESIZABLE_DEFAULT_ORIENTATION, "horizontal");
  assert.equal(isResizableOrientation("horizontal"), true);
  assert.equal(isResizableOrientation("vertical"), true);

  for (const invalid of ["diagonal", "", null, 1, "constructor"]) {
    assert.equal(isResizableOrientation(invalid), false);
    assert.equal(resolveResizableOrientation(invalid), "horizontal");
  }
});

test("forwards the Ark splitter root contract and all resize events", () => {
  assert.match(root, /from "@ark-ui\/vue\/splitter"/);
  assert.match(root, /<ArkSplitter\.Root/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="resizable"/);

  for (const prop of [
    "asChild",
    "defaultSize",
    "id",
    "ids",
    "keyboardResizeBy",
    "nonce",
    "orientation",
    "panels",
    "registry",
    "size",
  ]) {
    assert.match(
      root,
      new RegExp(prop === "asChild" ? `props\\.${prop}` : `props\\.${prop}`),
      prop,
    );
  }

  for (const event of [
    "collapse",
    "expand",
    "resize",
    "resizeEnd",
    "resizeStart",
    "update:size",
  ]) {
    assert.match(root, new RegExp(`emit\\('${event.replace(":", "\\:")}`));
  }

  assert.match(types, /ResizableExpandCollapseDetails/);
  assert.match(types, /ResizableResizeDetails/);
  assert.match(types, /ResizableResizeEndDetails/);
});

test("keeps Ark parts composable and forwards attributes", () => {
  for (const [name, component] of Object.entries({
    ResizablePanel: panel,
    ResizableResizeTrigger: trigger,
    ResizableHandle: handle,
    ResizableResizeTriggerIndicator: indicator,
  })) {
    assert.match(component, /from "@ark-ui\/vue\/splitter"/, name);
    assert.match(component, /defineOptions\(\{ inheritAttrs: false \}\)/, name);
    assert.match(component, /v-bind="\$attrs"/, name);
    assert.match(component, /data-slot="resizable-/, name);
  }
  assert.match(panel, /<ArkSplitter\.Panel/);
  assert.match(trigger, /<ArkSplitter\.ResizeTrigger/);
  assert.match(indicator, /<ArkSplitter\.ResizeTriggerIndicator/);
  assert.match(handle, /<ResizableResizeTriggerIndicator v-else/);
  assert.match(context, /<ArkSplitter\.Context v-slot="context">/);
  assert.match(context, /<slot v-bind="context"/);
});

test("exports both the friendly Handle alias and Ark-aligned trigger API", () => {
  assert.match(barrel, /export const Resizable = Object\.assign/);
  for (const part of [
    "Root",
    "RootProvider",
    "Panel",
    "Handle",
    "ResizeTrigger",
    "ResizeTriggerIndicator",
    "Context",
  ]) {
    assert.match(barrel, new RegExp(`${part}: Resizable`));
  }
  for (const name of [
    "ResizableHandle",
    "ResizablePanel",
    "ResizableResizeTrigger",
    "ResizableResizeTriggerIndicator",
    "ResizableApi",
    "ResizablePanelData",
    "ResizableEmits",
    "useSplitter",
    "useSplitterContext",
    "splitterAnatomy",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});

test("uses semantic tokens, logical orientation, and complete interaction states", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-line-strong",
    "--kappa-subtle",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  assert.match(styles, /data-orientation="horizontal"/);
  assert.match(styles, /data-orientation="vertical"/);
  assert.match(
    styles,
    /data-orientation="horizontal"\]\s*> :is\(\.kappa-resizable__handle/,
  );
  assert.match(
    styles,
    /data-orientation="vertical"\]\s*> :is\(\.kappa-resizable__handle/,
  );
  assert.match(styles, /:hover/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /data-dragging/);
  assert.match(styles, /data-disabled/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.match(styles, /inset-inline|inline-size/);
  assert.doesNotMatch(styles, /(?:left|right):/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});
