import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const rootSource = source("CollapsibleSection.vue");
const headerSource = source("CollapsibleSectionHeader.vue");
const triggerSource = source("CollapsibleSectionTrigger.vue");
const indicatorSource = source("CollapsibleSectionIndicator.vue");
const actionsSource = source("CollapsibleSectionActions.vue");
const contentSource = source("CollapsibleSectionContent.vue");
const typesSource = source("collapsible-section.ts");
const styles = source("collapsible-section.css");
const barrel = source("index.ts");

test("forwards the accessible Ark UI disclosure state", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/collapsible"/);
  assert.match(rootSource, /<ArkCollapsible\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);

  for (const binding of [
    "default-open",
    "disabled",
    "id",
    "ids",
    "lazy-mount",
    "open",
    "unmount-on-exit",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /@open-change="emit\('openChange', \$event\)"/);
  assert.match(rootSource, /@update:open="emit\('update:open', \$event\)"/);
  assert.match(typesSource, /"update:open": \[open: boolean\]/);
});

test("offers a validated compact density", () => {
  assert.match(typesSource, /COLLAPSIBLE_SECTION_SIZES = \["compact", "base"\]/);
  assert.match(typesSource, /size\?: CollapsibleSectionSize/);
  assert.match(rootSource, /:data-size="resolvedSize"/);
  assert.match(rootSource, /resolveCollapsibleSectionSize\(props\.size\)/);
  assert.match(styles, /\[data-size="compact"\]/);
  assert.match(styles, /min-block-size: 1\.5rem/);
});

test("keeps header actions outside the disclosure trigger", () => {
  assert.match(headerSource, /data-slot="collapsible-section-header"/);
  assert.match(triggerSource, /<ArkCollapsible\.Trigger/);
  assert.match(triggerSource, /data-slot="collapsible-section-trigger"/);
  assert.match(triggerSource, /<CollapsibleSectionIndicator \/>/);
  assert.match(actionsSource, /data-slot="collapsible-section-actions"/);
  assert.doesNotMatch(triggerSource, /CollapsibleSectionActions/);
  assert.doesNotMatch(actionsSource, /ArkCollapsible\.Trigger/);
});

test("provides a compact indicator and attribute-transparent content", () => {
  assert.match(indicatorSource, /<ArkCollapsible\.Indicator/);
  assert.match(indicatorSource, /aria-hidden="true"/);
  assert.match(indicatorSource, /focusable="false"/);
  assert.match(contentSource, /<ArkCollapsible\.Content/);
  assert.match(contentSource, /v-bind="\$attrs"/);
  assert.match(contentSource, /data-slot="collapsible-section-content-body"/);
  assert.match(contentSource, /<slot v-else \/>/);
});

test("uses dense logical styling and complete interaction states", () => {
  assert.match(styles, /min-block-size: 2\.5rem/);
  assert.match(styles, /font-size: 0\.8125rem/);
  assert.match(styles, /padding-inline: 0\.625rem 0\.375rem/);
  assert.match(styles, /\.kappa-collapsible-section__actions/);
  assert.match(styles, /\[data-state="open"\]/);
  assert.match(styles, /\[data-state="closed"\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /:dir\(rtl\)/);
  assert.match(styles, /var\(--height\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});

test("exports the full compound component", () => {
  assert.match(barrel, /export const CollapsibleSection = Object\.assign/);
  for (const part of ["Root", "Header", "Trigger", "Indicator", "Actions", "Content"]) {
    assert.match(barrel, new RegExp(`${part}: CollapsibleSection${part}`));
  }
  for (const partSource of [rootSource, headerSource, triggerSource, indicatorSource, actionsSource, contentSource]) {
    assert.match(partSource, /defineOptions\(\{ inheritAttrs: false \}\)/);
  }
});
