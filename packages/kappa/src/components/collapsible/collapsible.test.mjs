import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Collapsible.vue");
const providerSource = readSource("./CollapsibleRootProvider.vue");
const triggerSource = readSource("./CollapsibleTrigger.vue");
const contentSource = readSource("./CollapsibleContent.vue");
const indicatorSource = readSource("./CollapsibleIndicator.vue");
const contextSource = readSource("./CollapsibleContext.vue");
const typesSource = readSource("./collapsible.ts");
const styles = readSource("./collapsible.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the exact Ark root prop and event contract", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/collapsible"/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="collapsible"/);

  for (const prop of [
    "asChild",
    "collapsedHeight",
    "collapsedWidth",
    "defaultOpen",
    "disabled",
    "id",
    "ids",
    "lazyMount",
    "open",
    "unmountOnExit",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const binding of [
    "as-child",
    "collapsed-height",
    "collapsed-width",
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

  assert.match(rootSource, /@exit-complete="emit\('exitComplete'\)"/);
  assert.match(rootSource, /@open-change="emit\('openChange', \$event\)"/);
  assert.match(rootSource, /@update:open="emit\('update:open', \$event\)"/);
  assert.match(typesSource, /"update:open": \[open: boolean\]/);
  assert.match(typesSource, /openChange: \[details: CollapsibleOpenChangeDetails\]/);
});

test("wraps every public Ark part without hiding attributes", () => {
  assert.match(triggerSource, /<ArkCollapsible\.Trigger/);
  assert.match(triggerSource, /data-slot="collapsible-trigger"/);
  assert.match(triggerSource, /v-bind="\$attrs"/);
  assert.match(triggerSource, /:disabled="props\.disabled"/);
  assert.match(contentSource, /<ArkCollapsible\.Content/);
  assert.match(contentSource, /data-slot="collapsible-content"/);
  assert.match(contentSource, /class="kappa-collapsible__content-body"/);
  assert.match(indicatorSource, /<ArkCollapsible\.Indicator/);
  assert.match(indicatorSource, /data-slot="collapsible-indicator"/);
  assert.match(contextSource, /<ArkCollapsible\.Context v-slot="context">/);
  assert.match(contextSource, /<slot v-bind="context" \/>/);
});

test("provides one accessible indicator and keeps asChild composition valid", () => {
  assert.match(triggerSource, /<slot v-if="!props\.asChild" name="indicator">/);
  assert.match(triggerSource, /<CollapsibleIndicator \/>/);
  assert.match(indicatorSource, /aria-hidden="true"/);
  assert.match(indicatorSource, /focusable="false"/);
  assert.match(indicatorSource, /viewBox="0 0 16 16"/);
  assert.equal((indicatorSource.match(/<svg/g) ?? []).length, 1);
});

test("supports external state machines through RootProvider and hooks", () => {
  assert.match(providerSource, /<ArkCollapsible\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(providerSource, /v-bind="\$attrs"/);
  assert.match(typesSource, /CollapsibleApi = UnwrapRef<UseCollapsibleReturn>/);
  assert.match(typesSource, /CollapsibleContextValue = UnwrapRef<UseCollapsibleContext>/);
  assert.match(moduleBarrel, /useCollapsible/);
  assert.match(moduleBarrel, /useCollapsibleContext/);
  assert.match(moduleBarrel, /collapsibleAnatomy/);
});

test("exports named parts and the complete compound API", () => {
  for (const part of ["Root", "RootProvider", "Trigger", "Content", "Indicator", "Context"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Collapsible${part}`));
    assert.match(moduleBarrel, new RegExp(`Collapsible${part}`));
  }

  for (const contract of [
    "CollapsibleProps",
    "CollapsibleEmits",
    "CollapsibleRootProviderProps",
    "CollapsibleTriggerProps",
    "CollapsibleContentProps",
    "CollapsibleIndicatorProps",
    "CollapsibleContextSlots",
    "CollapsibleOpenChangeDetails",
  ]) {
    assert.match(moduleBarrel, new RegExp(contract));
  }
});

test("uses dense, logical, state-driven Kappa styling", () => {
  assert.match(styles, /min-block-size: 2\.625rem/);
  assert.match(styles, /font-size: 0\.875rem/);
  assert.match(styles, /font-weight: 600/);
  assert.match(styles, /margin-inline-start: auto/);
  assert.match(styles, /var\(--height\)/);
  assert.match(styles, /var\(--collapsed-height, 0\)/);
  assert.match(styles, /var\(--collapsed-width, var\(--width\)\)/);
  assert.match(styles, /\[data-has-collapsed-size\]/);
  assert.match(styles, /\[data-state="open"\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /:dir\(rtl\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:collapsed-height|collapsed-width|width|height)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
