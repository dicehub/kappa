import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Dialog.vue");
const providerSource = readSource("./DialogRootProvider.vue");
const triggerSource = readSource("./DialogTrigger.vue");
const backdropSource = readSource("./DialogBackdrop.vue");
const positionerSource = readSource("./DialogPositioner.vue");
const contentSource = readSource("./DialogContent.vue");
const closeSource = readSource("./DialogClose.vue");
const titleSource = readSource("./DialogTitle.vue");
const descriptionSource = readSource("./DialogDescription.vue");
const contextSource = readSource("./DialogContext.vue");
const typesSource = readSource("./dialog.ts");
const styles = readSource("./dialog.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the Ark root props and complete event contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/dialog"/);
  assert.match(rootSource, /v-bind="\{ \.\.\.rootProps, \.\.\.\$attrs \}"/);

  for (const prop of [
    "closeOnEscape",
    "closeOnInteractOutside",
    "defaultOpen",
    "defaultTriggerValue",
    "finalFocusEl",
    "id",
    "ids",
    "initialFocusEl",
    "lazyMount",
    "modal",
    "open",
    "persistentElements",
    "preventScroll",
    "restoreFocus",
    "role",
    "trapFocus",
    "triggerValue",
    "unmountOnExit",
  ]) {
    assert.match(typesSource, new RegExp(`${prop}\\?:`));
  }

  for (const event of [
    "escapeKeyDown",
    "exitComplete",
    "focusOutside",
    "interactOutside",
    "openChange",
    "pointerDownOutside",
    "requestDismiss",
    "triggerValueChange",
    "update:open",
    "update:triggerValue",
  ]) {
    assert.match(rootSource, new RegExp(`emit\\('${event.replace(":", "\\:")}`));
    assert.match(typesSource, new RegExp(`"?${event.replace(":", "\\:")}`));
  }
});

test("makes alert and explicit confirmation dialogs resistant to pointer dismissal", () => {
  assert.match(typesSource, /disablePointerDismissal\?: boolean/);
  assert.match(rootSource, /if \(props\.disablePointerDismissal\) return false/);
  assert.match(rootSource, /props\.role === "alertdialog" \? false : undefined/);
  assert.match(rootSource, /if \(props\.closeOnInteractOutside !== undefined\)/);
  assert.match(rootSource, /role: DIALOG_DEFAULT_ROLE/);
});

test("composes a viewport-safe teleported surface", () => {
  assert.match(contentSource, /<Teleport/);
  assert.match(contentSource, /:disabled="!props\.teleport \|\| !isMounted"/);
  assert.match(contentSource, /<DialogBackdrop v-if="props\.showBackdrop"/);
  assert.match(contentSource, /<DialogPositioner>/);
  assert.match(contentSource, /<ArkDialog\.Content/);
  assert.match(contentSource, /data-slot="dialog-content"/);
  assert.match(contentSource, /:data-size="resolvedSize"/);
  assert.match(contentSource, /<DialogClose :label="props\.closeLabel"/);
  assert.match(typesSource, /showBackdrop\?: boolean/);
  assert.match(typesSource, /showCloseButton\?: boolean/);
  assert.match(typesSource, /teleportTo\?: TeleportProps\["to"\]/);
});

test("wraps every Ark part without hiding consumer attributes", () => {
  for (const [source, part, slot] of [
    [triggerSource, "Trigger", "dialog-trigger"],
    [backdropSource, "Backdrop", "dialog-backdrop"],
    [positionerSource, "Positioner", "dialog-positioner"],
    [titleSource, "Title", "dialog-title"],
    [descriptionSource, "Description", "dialog-description"],
  ]) {
    assert.match(source, new RegExp(`<ArkDialog\\.${part}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
  }

  assert.match(contextSource, /<ArkDialog\.Context v-slot="context">/);
  assert.match(contextSource, /<slot v-bind="context" \/>/);
  assert.match(providerSource, /<ArkDialog\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
});

test("provides localized, unique, and composable close controls", () => {
  assert.match(closeSource, /useId/);
  assert.match(closeSource, /`kappa-dialog-close-\$\{generatedId\}`/);
  assert.match(closeSource, /attrs\["aria-label"\]/);
  assert.match(closeSource, /:as-child="props\.asChild"/);
  assert.match(closeSource, /class="kappa-dialog__close-trigger"/);
  assert.match(closeSource, /class="kappa-dialog__close"/);
  assert.equal((closeSource.match(/<svg/g) ?? []).length, 1);
});

test("exports named parts, constants, types, hooks, and the compound API", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Trigger",
    "Backdrop",
    "Positioner",
    "Content",
    "Header",
    "Title",
    "Description",
    "Footer",
    "Close",
    "Context",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Dialog${part}`));
    assert.match(moduleBarrel, new RegExp(`Dialog${part}`));
  }

  assert.match(moduleBarrel, /CloseTrigger: DialogClose/);
  assert.match(moduleBarrel, /DIALOG_SIZES/);
  assert.match(moduleBarrel, /resolveDialogRole/);
  assert.match(moduleBarrel, /useDialog/);
  assert.match(moduleBarrel, /useDialogContext/);
  assert.match(moduleBarrel, /dialogAnatomy/);
});

test("uses semantic, logical, state-driven Kappa styling", () => {
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
  assert.match(styles, /max-block-size: calc\(100dvb - 1\.5rem\)/);
  assert.match(styles, /\[data-size="sm"\]/);
  assert.match(styles, /\[data-size="lg"\]/);
  assert.match(styles, /\[data-size="xl"\]/);
  assert.match(styles, /\[data-state="open"\]/);
  assert.match(styles, /\[data-state="closed"\]/);
  assert.match(styles, /direction: inherit/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.kappa-dialog__content\[data-state\]/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:layer-index)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
