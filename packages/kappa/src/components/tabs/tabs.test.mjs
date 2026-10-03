import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Tabs.vue");
const providerSource = readSource("./TabsRootProvider.vue");
const listSource = readSource("./TabsList.vue");
const triggerSource = readSource("./TabsTrigger.vue");
const contentSource = readSource("./TabsContent.vue");
const indicatorSource = readSource("./TabsIndicator.vue");
const contextSource = readSource("./TabsContext.vue");
const typesSource = readSource("./tabs.ts");
const styles = readSource("./tabs.css");
const moduleBarrel = readSource("./index.ts");

test("forwards Ark root props, events, and Kappa direction handling", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/tabs"/);
  assert.match(rootSource, /<ArkTabs\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="tabs"/);

  for (const prop of [
    "activationMode",
    "asChild",
    "composite",
    "defaultValue",
    "dir",
    "deselectable",
    "id",
    "ids",
    "lazyMount",
    "loopFocus",
    "modelValue",
    "navigate",
    "orientation",
    "translations",
    "unmountOnExit",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const binding of [
    "activation-mode",
    "as-child",
    "composite",
    "default-value",
    "deselectable",
    "id",
    "ids",
    "lazy-mount",
    "loop-focus",
    "model-value",
    "navigate",
    "orientation",
    "translations",
    "unmount-on-exit",
  ]) {
    assert.match(rootSource, new RegExp(`:${binding}=`));
  }

  assert.match(rootSource, /@focus-change="emit\('focusChange', \$event\)"/);
  assert.match(rootSource, /@update:model-value="emit\('update:modelValue', \$event\)"/);
  assert.match(rootSource, /@value-change="emit\('valueChange', \$event\)"/);
  assert.match(rootSource, /<LocaleProvider :locale="locale">/);
  assert.match(rootSource, /props\.dir === "rtl" \? "ar" : "en-US"/);
  assert.match(typesSource, /TabsDirection = "ltr" \| "rtl"/);
  assert.match(typesSource, /"update:modelValue": \[value: string\]/);
});

test("preserves Ark lazy rendering and external machine provider support", () => {
  assert.match(providerSource, /<ArkTabs\.RootProvider/);
  assert.match(providerSource, /v-bind="\$attrs"/);
  assert.match(providerSource, /data-slot="tabs"/);
  assert.match(providerSource, /:lazy-mount="props\.lazyMount"/);
  assert.match(providerSource, /:unmount-on-exit="props\.unmountOnExit"/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(typesSource, /TabsApi = UnwrapRef<UseTabsReturn>/);
});

test("wraps every public Ark tabs part and forwards attributes", () => {
  for (const [source, primitive, slot] of [
    [listSource, "List", "tabs-list"],
    [triggerSource, "Trigger", "tabs-trigger"],
    [contentSource, "Content", "tabs-content"],
    [indicatorSource, "Indicator", "tabs-indicator"],
  ]) {
    assert.match(source, new RegExp(`<ArkTabs\\.${primitive}`));
    assert.match(source, /v-bind="\$attrs"/);
    assert.match(source, new RegExp(`data-slot="${slot}"`));
  }
  assert.match(triggerSource, /:disabled="props\.disabled"/);
  assert.match(triggerSource, /:value="props\.value"/);
  assert.match(contentSource, /:value="props\.value"/);
  assert.match(contextSource, /<ArkTabs\.Context v-slot="context">/);
  assert.match(contextSource, /<slot v-bind="context" \/>/);
});

test("resolves list variants and sizes without changing Ark behavior", () => {
  assert.match(typesSource, /TABS_VARIANTS = \["segmented", "line"\]/);
  assert.match(typesSource, /TABS_SIZES = \["sm", "base"\]/);
  assert.match(typesSource, /TABS_DEFAULT_VARIANT = "segmented"/);
  assert.match(typesSource, /TABS_DEFAULT_SIZE = "base"/);
  assert.match(typesSource, /interface TabsListProps/);
  assert.match(typesSource, /variant\?: TabsVariant/);
  assert.match(typesSource, /size\?: TabsSize/);
  assert.match(listSource, /resolveTabsVariant/);
  assert.match(listSource, /resolveTabsSize/);
  assert.match(listSource, /:data-variant="resolvedVariant"/);
  assert.match(listSource, /:data-size="resolvedSize"/);
});

test("exports named parts, compound API, and Ark hooks", () => {
  for (const part of ["Root", "RootProvider", "List", "Trigger", "Content", "Indicator", "Context"]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Tabs${part}`));
    assert.match(moduleBarrel, new RegExp(`Tabs${part}`));
  }
  for (const contract of [
    "TabsProps",
    "TabsEmits",
    "TabsRootProviderProps",
    "TabsTriggerProps",
    "TabsContentProps",
    "TabsIndicatorProps",
    "TabsListProps",
    "TabsSize",
    "TabsFocusChangeDetails",
    "TabsVariant",
    "TabsValueChangeDetails",
  ]) {
    assert.match(moduleBarrel, new RegExp(contract));
  }
  assert.match(moduleBarrel, /tabsAnatomy/);
  assert.match(moduleBarrel, /useTabs/);
  assert.match(moduleBarrel, /useTabsContext/);
  assert.match(moduleBarrel, /TABS_VARIANTS/);
  assert.match(moduleBarrel, /TABS_SIZES/);
});

test("uses state-driven logical styling with indicator, themes, and reduced motion", () => {
  assert.match(styles, /\.kappa-tabs__list \{/);
  assert.match(styles, /\.kappa-tabs__trigger \{/);
  assert.match(styles, /\.kappa-tabs__indicator \{/);
  assert.match(styles, /var\(--width/);
  assert.match(styles, /var\(--height/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(--kappa-overlay/);
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /var\(--kappa-accent-solid/);
  assert.match(styles, /--kappa-tabs-list-radius: 0\.5rem/);
  assert.match(
    styles,
    /--kappa-tabs-item-radius: calc\(var\(--kappa-tabs-list-radius\) - 1px - 0\.125rem\)/,
  );
  assert.match(styles, /border-radius: var\(--kappa-tabs-item-radius\)/);
  assert.match(styles, /\[data-variant="line"\]/);
  assert.match(
    styles,
    /\.kappa-tabs__list\[data-variant="line"\] \.kappa-tabs__indicator \{[\s\S]*?z-index: 2;/,
  );
  assert.match(styles, /scroll-padding-inline: 0\.25rem/);
  assert.match(styles, /\[data-size="sm"\]/);
  assert.match(styles, /\[aria-selected="true"\]/);
  assert.match(styles, /\[data-selected\]/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /\[data-orientation="vertical"\]/);
  assert.match(styles, /border-inline-end: 2px solid var\(--kappa-accent-solid/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-|(?:transition-duration|transition-timing-function|width|height|transition-property)(?![\w-]))[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
