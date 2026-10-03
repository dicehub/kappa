import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  HOVER_CARD_DEFAULT_CLOSE_DELAY,
  HOVER_CARD_DEFAULT_OPEN_DELAY,
  HOVER_CARD_DEFAULT_POSITIONING,
  resolveHoverCardPositioning,
} from "./hover-card.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const root = source("HoverCard.vue");
const provider = source("HoverCardRootProvider.vue");
const trigger = source("HoverCardTrigger.vue");
const positioner = source("HoverCardPositioner.vue");
const content = source("HoverCardContent.vue");
const arrow = source("HoverCardArrow.vue");
const arrowTip = source("HoverCardArrowTip.vue");
const context = source("HoverCardContext.vue");
const styles = source("hover-card.css");
const types = source("hover-card.ts");
const barrel = source("index.ts");

test("defines Ark-aligned timing and viewport-aware positioning defaults", () => {
  assert.equal(HOVER_CARD_DEFAULT_OPEN_DELAY, 600);
  assert.equal(HOVER_CARD_DEFAULT_CLOSE_DELAY, 300);
  assert.deepEqual(HOVER_CARD_DEFAULT_POSITIONING, {
    fitViewport: true,
    gutter: 8,
    overflowPadding: 12,
    placement: "bottom",
  });
  assert.deepEqual(resolveHoverCardPositioning({ placement: "top", gutter: 12 }), {
    fitViewport: true,
    gutter: 12,
    overflowPadding: 12,
    placement: "top",
  });
  assert.match(root, /openDelay: HOVER_CARD_DEFAULT_OPEN_DELAY/);
  assert.match(root, /closeDelay: HOVER_CARD_DEFAULT_CLOSE_DELAY/);
  assert.match(root, /resolvedPositioning/);
});

test("forwards Ark state, positioning, outside events, and controlled events", () => {
  assert.match(root, /from "@ark-ui\/vue\/hover-card"/);
  assert.match(root, /<ArkHoverCard\.Root/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /:positioning="resolvedPositioning"/);
  for (const prop of [
    "closeDelay",
    "defaultOpen",
    "defaultTriggerValue",
    "disabled",
    "id",
    "ids",
    "lazyMount",
    "open",
    "openDelay",
    "positioning",
    "triggerValue",
    "unmountOnExit",
  ]) {
    assert.match(types, new RegExp(`${prop}\\?:`));
  }
  for (const event of [
    "exitComplete",
    "focusOutside",
    "interactOutside",
    "openChange",
    "pointerDownOutside",
    "triggerValueChange",
    "update:open",
    "update:triggerValue",
  ]) {
    assert.match(root, new RegExp(`emit\\('${event.replace(":", "\\:")}`));
  }
});

test("composes trigger, positioner, content, arrow, provider, and context", () => {
  assert.match(trigger, /<ArkHoverCard\.Trigger/);
  assert.match(trigger, /v-bind="\$attrs"/);
  assert.match(trigger, /data-slot="hover-card-trigger"/);
  assert.match(trigger, /props\.asChild \? undefined : 'kappa-hover-card__trigger'/);
  assert.match(positioner, /<ArkHoverCard\.Positioner/);
  assert.match(positioner, /data-slot="hover-card-positioner"/);
  assert.match(content, /<Teleport/);
  assert.match(content, /:disabled="!props\.teleport \|\| !isMounted"/);
  assert.match(content, /<ArkHoverCard\.Positioner/);
  assert.match(content, /<ArkHoverCard\.Content/);
  assert.match(content, /data-slot="hover-card-content"/);
  assert.match(content, /<slot v-if="props\.showArrow" name="arrow"><HoverCardArrow \/><\/slot>/);
  assert.match(arrow, /<ArkHoverCard\.Arrow/);
  assert.match(arrow, /<HoverCardArrowTip \/>/);
  assert.match(arrowTip, /<ArkHoverCard\.ArrowTip/);
  assert.match(styles, /__arrow[\s\S]*z-index: 2;/);
  assert.match(styles, /clip-path: polygon/);
  assert.match(styles, /data-side="bottom"[\s\S]*translateY\(1px\)/);
  assert.match(styles, /data-side="left"[\s\S]*translateX\(-1px\)/);
  assert.match(styles, /animation: kappa-hover-card-arrow-in 70ms ease-out 70ms both/);
  assert.match(styles, /@keyframes kappa-hover-card-arrow-in/);
  assert.match(provider, /<ArkHoverCard\.RootProvider/);
  assert.match(provider, /@exit-complete/);
  assert.match(context, /<ArkHoverCard\.Context/);
  assert.match(context, /<slot v-bind="context" \/>/);
});

test("uses interactive, token-based, state-driven, and accessible styling", () => {
  for (const token of [
    "--kappa-control",
    "--kappa-default",
    "--kappa-emphasis",
    "--kappa-focus",
    "--kappa-font-sans",
    "--kappa-line",
    "--kappa-link-color",
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
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(styles, /\.kappa-hover-card__positioner[\s\S]{0,500}pointer-events:\s*none/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:z-index|available-width|available-height|transform-origin|arrow-background|arrow-size)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
});

test("exports the complete compound surface and Ark hooks", () => {
  assert.match(barrel, /export const HoverCard = Object\.assign/);
  for (const name of [
    "Root",
    "RootProvider",
    "Trigger",
    "Positioner",
    "Content",
    "Arrow",
    "ArrowTip",
    "Context",
  ]) {
    assert.match(barrel, new RegExp(`${name}: HoverCard${name}`));
  }
  assert.match(barrel, /useHoverCard/);
  assert.match(barrel, /hoverCardAnatomy/);
  for (const contract of [
    "HoverCardProps",
    "HoverCardEmits",
    "HoverCardContentProps",
    "HoverCardPositionerProps",
    "HoverCardPositioningOptions",
  ]) {
    assert.match(barrel, new RegExp(contract));
  }
});
