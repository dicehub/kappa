import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { POPOVER_DEFAULT_POSITIONING } from "./popover.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const root = source("Popover.vue");
const provider = source("PopoverRootProvider.vue");
const trigger = source("PopoverTrigger.vue");
const anchor = source("PopoverAnchor.vue");
const positioner = source("PopoverPositioner.vue");
const content = source("PopoverContent.vue");
const arrow = source("PopoverArrow.vue");
const arrowTip = source("PopoverArrowTip.vue");
const title = source("PopoverTitle.vue");
const description = source("PopoverDescription.vue");
const indicator = source("PopoverIndicator.vue");
const close = source("PopoverCloseTrigger.vue");
const context = source("PopoverContext.vue");
const styles = source("popover.css");
const types = source("popover.ts");
const barrel = source("index.ts");

test("defines viewport-aware positioning and safe popup defaults", () => {
  assert.deepEqual(POPOVER_DEFAULT_POSITIONING, {
    fitViewport: true,
    gutter: 8,
    overflowPadding: 12,
    placement: "bottom",
  });
  assert.match(root, /autoFocus: true/);
  assert.match(root, /DEFAULT_LOCALE, LocaleProvider, useLocaleContext/);
  assert.match(root, /<LocaleProvider :locale="locale">/);
  assert.match(root, /lazyMount: true/);
  assert.match(root, /modal: false/);
  assert.match(root, /portalled: true/);
  assert.match(root, /restoreFocus: true/);
  assert.match(root, /unmountOnExit: true/);
  assert.match(root, /resolvedPositioning/);
});

test("forwards Ark state, focus, dismissal, positioning, and controlled events", () => {
  assert.match(root, /from "@ark-ui\/vue\/popover"/);
  for (const prop of [
    "autoFocus",
    "closeOnEscape",
    "closeOnInteractOutside",
    "defaultOpen",
    "defaultTriggerValue",
    "dir",
    "finalFocusEl",
    "initialFocusEl",
    "lazyMount",
    "modal",
    "open",
    "persistentElements",
    "portalled",
    "positioning",
    "restoreFocus",
    "translations",
    "triggerValue",
    "unmountOnExit",
  ]) {
    assert.match(types, new RegExp(`${prop}\\?:`));
  }
  assert.match(types, /disabled\?:/);
  assert.match(trigger, /:disabled="props\.disabled"/);
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
    assert.match(root, new RegExp(`emit\\('${event.replace(":", "\\:")}`));
  }
  assert.match(root, /:positioning="resolvedPositioning"/);
  assert.match(root, /v-bind="\$attrs"/);
});

test("composes trigger, custom anchor, positioner, content, and arrow", () => {
  assert.match(trigger, /<ArkPopover\.Trigger/);
  assert.match(trigger, /data-slot="popover-trigger"/);
  assert.match(anchor, /<ArkPopover\.Anchor/);
  assert.match(anchor, /data-slot="popover-anchor"/);
  assert.match(positioner, /<ArkPopover\.Positioner/);
  assert.match(positioner, /data-slot="popover-positioner"/);
  assert.match(content, /<Teleport/);
  assert.match(content, /:disabled="!props\.teleport \|\| !isMounted"/);
  assert.match(content, /<ArkPopover\.Positioner/);
  assert.match(content, /<ArkPopover\.Content/);
  assert.match(content, /data-slot="popover-content"/);
  assert.match(content, /<slot v-if="props\.showArrow" name="arrow"><PopoverArrow \/><\/slot>/);
  assert.match(arrow, /<ArkPopover\.Arrow/);
  assert.match(arrow, /<PopoverArrowTip \/>/);
  assert.match(arrowTip, /<ArkPopover\.ArrowTip/);
});

test("provides title, description, indicator, close, provider, and context parts", () => {
  assert.match(title, /<ArkPopover\.Title/);
  assert.match(title, /data-slot="popover-title"/);
  assert.match(description, /<ArkPopover\.Description/);
  assert.match(description, /data-slot="popover-description"/);
  assert.match(indicator, /<ArkPopover\.Indicator/);
  assert.match(indicator, /data-slot="popover-indicator"/);
  assert.match(close, /<ArkPopover\.CloseTrigger/);
  assert.match(close, /props\.label !== undefined/);
  assert.doesNotMatch(close, /label: "Close popover"/);
  assert.doesNotMatch(close, /:aria-label="ariaLabel"/);
  assert.match(close, /:class="props\.asChild \? undefined : 'kappa-popover__close-trigger'"/);
  assert.match(close, /data-slot="popover-close-trigger"/);
  assert.match(provider, /<ArkPopover\.RootProvider/);
  assert.match(provider, /@exit-complete/);
  assert.match(context, /<ArkPopover\.Context/);
  assert.match(context, /<slot v-bind="context" \/>/);
});

test("uses semantic, state-driven, logical, and accessible styling", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-emphasis",
    "--kappa-focus",
    "--kappa-font-sans",
    "--kappa-line",
    "--kappa-overlay",
    "--kappa-popover-shadow",
    "--kappa-subtle",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  assert.match(styles, /var\(--available-height/);
  assert.match(styles, /var\(--available-width/);
  assert.match(styles, /var\(--transform-origin\)/);
  assert.match(styles, /\[data-side="top"\]/);
  assert.match(styles, /\[data-side="left"\]/);
  assert.match(styles, /\[data-side="right"\]/);
  assert.match(styles, /\[data-state="open"\]/);
  assert.match(styles, /\[data-state="closed"\]/);
  assert.match(styles, /\.kappa-popover__trigger:disabled/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /:dir\(rtl\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /pointer: coarse/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:z-index|available-width|available-height|transform-origin|arrow-background|arrow-size)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
});

test("exports the complete compound surface and Ark hooks", () => {
  assert.match(barrel, /export const Popover = Object\.assign/);
  for (const name of [
    "Root",
    "RootProvider",
    "Trigger",
    "Anchor",
    "Positioner",
    "Content",
    "Arrow",
    "ArrowTip",
    "Title",
    "Description",
    "Indicator",
    "Close",
    "CloseTrigger",
    "Context",
  ]) {
    assert.match(barrel, new RegExp(`${name}: Popover${name === "Close" ? "CloseTrigger" : name}`));
  }
  assert.match(barrel, /usePopover/);
  assert.match(barrel, /popoverAnatomy/);
  for (const contract of [
    "PopoverProps",
    "PopoverDirection",
    "PopoverEmits",
    "PopoverContentProps",
    "PopoverCloseTriggerProps",
    "PopoverPositioningOptions",
  ]) {
    assert.match(barrel, new RegExp(contract));
  }
});
