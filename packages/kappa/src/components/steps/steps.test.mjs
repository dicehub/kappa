import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Steps.vue");
const providerSource = readSource("./StepsRootProvider.vue");
const indicatorSource = readSource("./StepsIndicator.vue");
const listSource = readSource("./StepsList.vue");
const typesSource = readSource("./steps.ts");
const styles = readSource("./steps.css");
const moduleBarrel = readSource("./index.ts");

test("forwards Ark root props, events, and direction", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/steps"/);
  assert.match(rootSource, /<ArkSteps\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="steps"/);
  assert.match(rootSource, /<LocaleProvider :locale="locale">/);

  for (const prop of [
    "asChild",
    "count",
    "defaultStep",
    "dir",
    "id",
    "ids",
    "isStepSkippable",
    "isStepValid",
    "linear",
    "orientation",
    "step",
  ]) {
    assert.match(rootSource, new RegExp(`${prop}: undefined`));
  }

  for (const event of ["stepChange", "stepComplete", "stepInvalid", "update:step"]) {
    assert.match(rootSource, new RegExp(`emit\\('${event.replace(":", "\\:")}`));
  }
});

test("keeps external machine and item context support", () => {
  assert.match(providerSource, /<ArkSteps\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(typesSource, /StepsApi = UnwrapRef<UseStepsReturn>/);
  assert.match(typesSource, /StepsInvalidDetails = Parameters</);
  assert.match(typesSource, /NonNullable<UseStepsProps\["onStepInvalid"\]>/);
});

test("exposes item state from the indicator without wrapping its slot", () => {
  assert.match(indicatorSource, /useStepsItemContext/);
  assert.match(indicatorSource, /<ArkSteps\.Indicator/);
  assert.match(indicatorSource, /<slot v-bind="item" \/>/);
  assert.doesNotMatch(indicatorSource, /<ArkSteps\.ItemContext/);
});

test("resolves list size without changing Ark behavior", () => {
  assert.match(typesSource, /STEPS_SIZES = \["sm", "base"\]/);
  assert.match(typesSource, /STEPS_DEFAULT_SIZE = "base"/);
  assert.match(listSource, /resolveStepsSize/);
  assert.match(listSource, /:data-size="resolvedSize"/);
});

test("exports every compound part and Ark hook", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "List",
    "Item",
    "Trigger",
    "Indicator",
    "Separator",
    "Content",
    "CompletedContent",
    "PrevTrigger",
    "NextTrigger",
    "Progress",
    "Context",
    "ItemContext",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Steps${part}`));
  }

  for (const hook of ["stepsAnatomy", "useSteps", "useStepsContext", "useStepsItemContext"]) {
    assert.match(moduleBarrel, new RegExp(hook));
  }
});

test("uses compact logical styling and one reduced-motion-aware motion pattern", () => {
  assert.match(styles, /--kappa-steps-marker-size: 1\.5rem/);
  assert.match(styles, /--kappa-steps-marker-size: 1\.25rem/);
  assert.match(styles, /cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.match(styles, /min-inline-size: max-content/);
  assert.match(styles, /overflow-x: auto/);
  assert.match(styles, /\[data-orientation="vertical"\]/);
  assert.match(styles, /\[data-complete\]/);
  assert.match(styles, /\[data-current\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.match(styles, /\.kappa-steps__progress\[data-complete\]::after/);
  assert.match(styles, /inline-size: var\(--percent, 0%\)/);
  assert.doesNotMatch(styles, /calc\(var\(--percent/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
