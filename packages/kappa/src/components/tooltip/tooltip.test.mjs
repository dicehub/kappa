import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  TOOLTIP_DEFAULT_CLOSE_DELAY,
  TOOLTIP_DEFAULT_OPEN_DELAY,
  TOOLTIP_DEFAULT_POSITIONING,
} from "./tooltip.ts";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");
const root = source("Tooltip.vue");
const trigger = source("TooltipTrigger.vue");
const content = source("TooltipContent.vue");
const arrow = source("TooltipArrow.vue");
const styles = source("tooltip.css");
const barrel = source("index.ts");

test("defines stable Kappa timing and viewport-aware positioning defaults", () => {
  assert.equal(TOOLTIP_DEFAULT_OPEN_DELAY, 400);
  assert.equal(TOOLTIP_DEFAULT_CLOSE_DELAY, 150);
  assert.deepEqual(TOOLTIP_DEFAULT_POSITIONING, {
    fitViewport: true,
    gutter: 8,
    overflowPadding: 12,
    placement: "top",
  });
});

test("forwards Ark UI state, positioning, and controlled events", () => {
  assert.match(root, /ArkTooltip\.Root/);
  assert.match(root, /:positioning="resolvedPositioning"/);
  assert.match(root, /@open-change="emit\('openChange', \$event\)"/);
  assert.match(root, /@update:open="emit\('update:open', \$event\)"/);
  assert.match(root, /@update:trigger-value="emit\('update:triggerValue', \$event\)"/);
  assert.doesNotMatch(root, /v-bind="\$attrs"/);
});

test("provides an attribute-transparent trigger and portalled content convenience", () => {
  assert.match(trigger, /v-bind="\$attrs"/);
  assert.match(trigger, /data-slot="tooltip-trigger"/);
  assert.match(trigger, /props\.asChild \? undefined : 'kappa-tooltip__trigger'/);
  assert.match(content, /<Teleport/);
  assert.match(content, /ArkTooltip\.Positioner/);
  assert.match(content, /v-bind="\$attrs"/);
  assert.match(content, /data-slot="tooltip-content"/);
  assert.match(content, /<TooltipArrow/);
  assert.match(arrow, /ArkTooltip\.Arrow/);
  assert.match(arrow, /<TooltipArrowTip/);
});

test("styles the popup with Kappa tokens and complete motion fallbacks", () => {
  for (const token of [
    "--kappa-accent-contrast",
    "--kappa-emphasis",
    "--kappa-focus",
    "--kappa-font-sans",
    "--kappa-popover-shadow",
  ]) {
    assert.match(styles, new RegExp(token));
  }
  assert.match(styles, /var\(--available-width/);
  assert.match(styles, /:has\(> \.kappa-tooltip__content\[data-state="open"\]\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:z-index|available-width|transform-origin|arrow-background|arrow-size)(?![\w-]))[a-z][\w-]*/);
});

test("exports the complete compound surface", () => {
  assert.match(barrel, /export const Tooltip = Object\.assign/);
  for (const name of ["Root", "RootProvider", "Trigger", "Content", "Arrow", "ArrowTip", "Context"]) {
    assert.match(barrel, new RegExp(`${name}: Tooltip${name === "Root" ? "Root" : name}`));
  }
  assert.match(barrel, /useTooltip/);
  assert.match(barrel, /tooltipAnatomy/);
});
