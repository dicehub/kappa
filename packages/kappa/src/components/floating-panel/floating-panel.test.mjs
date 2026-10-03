import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { FLOATING_PANEL_DEFAULT_MIN_SIZE } from "./floating-panel.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const root = source("FloatingPanel.vue");
const rootProvider = source("FloatingPanelRootProvider.vue");
const positioner = source("FloatingPanelPositioner.vue");
const content = source("FloatingPanelContent.vue");
const control = source("FloatingPanelControl.vue");
const stageTrigger = source("FloatingPanelStageTrigger.vue");
const close = source("FloatingPanelClose.vue");
const body = source("FloatingPanelBody.vue");
const resizeTrigger = source("FloatingPanelResizeTrigger.vue");
const styles = source("floating-panel.css");
const barrel = source("index.ts");

test("defines reachable default geometry", () => {
  assert.deepEqual(FLOATING_PANEL_DEFAULT_MIN_SIZE, { width: 240, height: 160 });
});

test("forwards the complete Ark floating-panel state contract", () => {
  assert.match(root, /from "@ark-ui\/vue\/floating-panel"/);
  assert.match(root, /<ArkFloatingPanel\.Root/);
  assert.match(root, /allowOverflow: false/);
  assert.match(root, /closeOnEscape: true/);
  assert.match(root, /disabled: false/);
  assert.match(root, /draggable: true/);
  assert.match(root, /lazyMount: true/);
  assert.match(root, /resizable: true/);
  assert.match(root, /restoreFocus: true/);
  assert.match(root, /unmountOnExit: false/);
  assert.match(root, /minSize: \(\) => \(\{ \.\.\.FLOATING_PANEL_DEFAULT_MIN_SIZE \}\)/);
  assert.match(rootProvider, /lazyMount: true/);
  assert.match(rootProvider, /unmountOnExit: false/);

  for (const event of [
    "exitComplete",
    "openChange",
    "positionChange",
    "positionChangeEnd",
    "sizeChange",
    "sizeChangeEnd",
    "stageChange",
    "update:open",
    "update:position",
    "update:size",
  ]) {
    assert.match(root, new RegExp(`emit\\('${event.replace(":", "\\:")}`), event);
  }
});

test("keeps Ark parts composable and protects header controls from dragging", () => {
  for (const [name, component, part] of [
    ["Positioner", positioner, "Positioner"],
    ["Content", content, "Content"],
    ["Control", control, "Control"],
    ["StageTrigger", stageTrigger, "StageTrigger"],
    ["Close", close, "CloseTrigger"],
    ["Body", body, "Body"],
    ["ResizeTrigger", resizeTrigger, "ResizeTrigger"],
  ]) {
    assert.match(component, /from "@ark-ui\/vue\/floating-panel"/, name);
    assert.match(component, new RegExp(`<ArkFloatingPanel\\.${part}`), name);
    assert.match(
      component,
      name === "StageTrigger" ? /v-bind="forwardedAttrs"/ : /v-bind="\$attrs"/,
      name,
    );
    assert.match(component, /data-slot="floating-panel-/, name);
  }

  assert.match(control, /data-no-drag/);
  assert.match(positioner, /<Teleport/);
  assert.match(positioner, /calc\(var\(--kappa-floating-panel-z-index, 800\) \+ var\(--z-index, 0\)\)/);
  assert.match(stageTrigger, /forwardedAttrs/);
});

test("exports the full compound surface and Ark hooks", () => {
  assert.match(barrel, /export const FloatingPanel = Object\.assign/);
  for (const part of [
    "Root",
    "RootProvider",
    "Trigger",
    "Positioner",
    "Content",
    "DragTrigger",
    "Header",
    "Title",
    "Control",
    "StageTrigger",
    "Close",
    "CloseTrigger",
    "Body",
    "ResizeTrigger",
    "Context",
  ]) {
    assert.match(barrel, new RegExp(`${part}: FloatingPanel`), part);
  }
  assert.match(barrel, /useFloatingPanel/);
  assert.match(barrel, /useFloatingPanelContext/);
  assert.match(barrel, /floatingPanelAnatomy/);
});

test("uses semantic tokens and complete interaction states", () => {
  for (const token of [
    "--kappa-base",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-line-strong",
    "--kappa-popover-shadow",
    "--kappa-strong",
    "--kappa-subtle",
    "--kappa-tint",
  ]) {
    assert.match(styles, new RegExp(token));
  }

  assert.match(styles, /data-topmost/);
  assert.match(styles, /data-behind/);
  assert.match(styles, /data-dragging/);
  assert.match(styles, /data-disabled/);
  assert.match(styles, /data-axis="ne"/);
  assert.match(styles, /\[hidden\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
});
