import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Accordion.vue");
const itemSource = readSource("./AccordionItem.vue");
const triggerSource = readSource("./AccordionTrigger.vue");
const contentSource = readSource("./AccordionContent.vue");
const indicatorSource = readSource("./AccordionIndicator.vue");
const typesSource = readSource("./accordion.ts");
const styles = readSource("./accordion.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the exact Ark root prop and event contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/accordion"/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="accordion"/);

  for (const prop of [
    "asChild",
    "collapsible",
    "defaultValue",
    "disabled",
    "dir",
    "id",
    "ids",
    "lazyMount",
    "modelValue",
    "multiple",
    "orientation",
    "unmountOnExit",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const binding of [
    "as-child",
    "collapsible",
    "default-value",
    "disabled",
    "id",
    "ids",
    "lazy-mount",
    "model-value",
    "multiple",
    "orientation",
    "unmount-on-exit",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /@focus-change="emit\('focusChange', \$event\)"/);
  assert.match(rootSource, /@update:model-value="emit\('update:modelValue', \$event\)"/);
  assert.match(rootSource, /@value-change="emit\('valueChange', \$event\)"/);
  assert.match(rootSource, /LocaleProvider :locale="locale"/);
  assert.match(rootSource, /props\.dir === "rtl" \? "ar" : "en-US"/);
  assert.match(typesSource, /"update:modelValue": \[value: string\[\]\]/);
  assert.match(typesSource, /AccordionDirection = "ltr" \| "rtl"/);
});

test("keeps required item values and undefined disabled inheritance", () => {
  assert.match(typesSource, /value: ArkAccordionItemProps\["value"\]/);
  assert.match(itemSource, /asChild: undefined/);
  assert.match(itemSource, /disabled: undefined/);
  assert.match(itemSource, /:value="value"/);
  assert.match(itemSource, /v-bind="\$attrs"/);
  assert.match(itemSource, /data-slot="accordion-item"/);
});

test("provides one default indicator and a customization slot", () => {
  assert.match(triggerSource, /<ArkAccordion\.ItemTrigger/);
  assert.match(triggerSource, /data-slot="accordion-trigger"/);
  assert.match(triggerSource, /<slot name="indicator">/);
  assert.match(triggerSource, /<AccordionIndicator \/>/);
  assert.match(indicatorSource, /<ArkAccordion\.ItemIndicator/);
  assert.match(indicatorSource, /data-slot="accordion-indicator"/);
  assert.match(indicatorSource, /aria-hidden="true"/);
  assert.match(indicatorSource, /focusable="false"/);
  assert.match(indicatorSource, /viewBox="0 0 16 16"/);
  assert.equal((indicatorSource.match(/<svg/g) ?? []).length, 1);
});

test("stabilizes directional keyboard navigation around the Ark primitive", () => {
  assert.match(triggerSource, /@keydown\.capture="handleDirectionalKeydown"/);
  assert.match(triggerSource, /event\.key === "Home"/);
  assert.match(triggerSource, /event\.key === "End"/);
  assert.match(triggerSource, /event\.key === "ArrowDown"/);
  assert.match(triggerSource, /event\.key === "ArrowLeft"/);
  assert.match(triggerSource, /direction === "rtl"/);
  assert.match(triggerSource, /:not\(:disabled\)/);
  assert.match(triggerSource, /event\.preventDefault\(\)/);
});

test("wraps content for Ark measured-height animation and spacing", () => {
  assert.match(contentSource, /<ArkAccordion\.ItemContent/);
  assert.match(contentSource, /data-slot="accordion-content"/);
  assert.match(contentSource, /class="kappa-accordion__content-body"/);
  assert.match(contentSource, /data-slot="accordion-content-body"/);
  assert.match(contentSource, /v-bind="\$attrs"/);
});

test("exports named parts and the compound API", () => {
  for (const part of ["Root", "Item", "Trigger", "Content", "Indicator"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Accordion${part}`));
    assert.match(moduleBarrel, new RegExp(`Accordion${part}`));
  }
  assert.match(moduleBarrel, /AccordionProps/);
  assert.match(moduleBarrel, /AccordionEmits/);
  assert.match(moduleBarrel, /AccordionFocusChangeDetails/);
  assert.match(moduleBarrel, /AccordionValueChangeDetails/);
});

test("uses refined, logical, state-driven Kappa styling", () => {
  assert.match(styles, /min-block-size: 2\.625rem/);
  assert.match(styles, /font-size: 0\.875rem/);
  assert.match(styles, /font-weight: 500/);
  assert.match(styles, /line-height: 1\.25rem/);
  assert.match(styles, /padding-block-end: 0\.625rem/);
  assert.match(styles, /\.kappa-accordion__item:not\(:last-child\)/);
  assert.match(styles, /margin-inline-start: auto/);
  assert.match(styles, /var\(--height\)/);
  assert.match(styles, /\[data-state="open"\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /\[data-orientation="horizontal"\]/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:height)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
