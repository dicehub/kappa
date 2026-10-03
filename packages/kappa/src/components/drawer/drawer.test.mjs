import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Drawer.vue");
const contentSource = readSource("./DrawerContent.vue");
const closeSource = readSource("./DrawerClose.vue");
const grabberSource = readSource("./DrawerGrabber.vue");
const swipeAreaSource = readSource("./DrawerSwipeArea.vue");
const typesSource = readSource("./drawer.ts");
const styles = readSource("./drawer.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the Ark root behavior and controlled state contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/drawer"/);
  assert.match(rootSource, /v-bind="\{ \.\.\.rootProps, \.\.\.\$attrs \}"/);

  for (const prop of [
    "closeOnEscape",
    "closeOnInteractOutside",
    "closeThreshold",
    "defaultOpen",
    "defaultSnapPoint",
    "defaultTriggerValue",
    "finalFocusEl",
    "initialFocusEl",
    "lazyMount",
    "locale",
    "modal",
    "open",
    "preventDragOnScroll",
    "preventScroll",
    "restoreFocus",
    "role",
    "snapPoint",
    "snapPoints",
    "snapToSequentialPoints",
    "swipeDirection",
    "swipeVelocityThreshold",
    "trapFocus",
    "triggerValue",
    "unmountOnExit",
  ]) {
    assert.match(typesSource, new RegExp(`${prop}\\?:`));
  }

  for (const event of [
    "exitComplete",
    "openChange",
    "snapPointChange",
    "triggerValueChange",
    "update:open",
    "update:snapPoint",
    "update:triggerValue",
  ]) {
    assert.match(rootSource, new RegExp(`emit\\('${event.replace(":", "\\:")}`));
    assert.match(typesSource, new RegExp(`"?${event.replace(":", "\\:")}`));
  }
});

test("composes portal layers, a directional grabber, and optional close control", () => {
  assert.match(rootSource, /<LocaleProvider :locale="props\.locale">/);
  assert.match(contentSource, /<Teleport/);
  assert.match(contentSource, /:disabled="!props\.teleport \|\| !isMounted"/);
  assert.match(contentSource, /<DrawerBackdrop v-if="props\.showBackdrop"/);
  assert.match(contentSource, /<DrawerPositioner>/);
  assert.match(contentSource, /<ArkDrawer\.Content/);
  assert.match(contentSource, /:draggable="props\.draggable"/);
  assert.match(contentSource, /<DrawerGrabber \/>/);
  assert.match(contentSource, /<DrawerClose :label="props\.closeLabel"/);
  assert.match(typesSource, /showGrabber\?: boolean/);
  assert.match(typesSource, /teleportTo\?: TeleportProps\["to"\]/);
});

test("keeps the grabber and close controls composable and accessible", () => {
  assert.match(grabberSource, /<ArkDrawer\.Grabber/);
  assert.match(grabberSource, /<DrawerGrabberIndicator v-else/);
  assert.match(closeSource, /useId/);
  assert.match(closeSource, /`kappa-drawer-close-\$\{generatedId\}`/);
  assert.match(closeSource, /attrs\["aria-label"\]/);
  assert.match(closeSource, /class="kappa-drawer__close-trigger"/);
  assert.equal((closeSource.match(/<svg/g) ?? []).length, 1);
  assert.match(swipeAreaSource, /<ArkDrawer\.SwipeArea/);
});

test("exports the full compound and named-part API", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Stack",
    "Trigger",
    "SwipeArea",
    "Backdrop",
    "Positioner",
    "Content",
    "Grabber",
    "GrabberIndicator",
    "Header",
    "Title",
    "Description",
    "Footer",
    "Close",
    "Context",
    "Indent",
    "IndentBackground",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Drawer${part}`));
    assert.match(moduleBarrel, new RegExp(`Drawer${part}`));
  }

  assert.match(moduleBarrel, /CloseTrigger: DrawerClose/);
  assert.match(moduleBarrel, /DRAWER_SWIPE_DIRECTIONS/);
  assert.match(moduleBarrel, /useDrawer/);
  assert.match(moduleBarrel, /useDrawerContext/);
  assert.match(moduleBarrel, /useDrawerStackContext/);
  assert.match(moduleBarrel, /drawerAnatomy/);
});

test("uses semantic, logical, direction-aware Kappa styling", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-subtle",
    "--kappa-tint",
  ]) {
    assert.match(styles, new RegExp(token));
  }

  assert.match(styles, /var\(--layer-index, 0\)/);
  assert.match(styles, /var\(--drawer-swipe-strength, 1\)/);
  assert.match(styles, /\.kappa-drawer__positioner[\s\S]*?direction:\s*ltr/);
  for (const direction of ["up", "down", "left", "right"]) {
    assert.match(styles, new RegExp(`data-swipe-direction="${direction}"`));
  }
  assert.match(styles, /data-nested-drawer-open/);
  assert.match(styles, /data-swiping/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:layer-index|drawer-swipe-strength|nested-drawers|drawer-swipe-progress)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
