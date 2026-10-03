import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

const rootSource = readSource("./Slider.vue");
const providerSource = readSource("./SliderRootProvider.vue");
const partSources = Object.fromEntries(
  [
    "SliderContext.vue",
    "SliderControl.vue",
    "SliderDraggingIndicator.vue",
    "SliderHiddenInput.vue",
    "SliderLabel.vue",
    "SliderMarkerGroup.vue",
    "SliderMarker.vue",
    "SliderRange.vue",
    "SliderThumb.vue",
    "SliderTrack.vue",
    "SliderValueText.vue",
  ].map((name) => [name, readSource(`./${name}`)]),
);
const typesSource = readSource("./slider.ts");
const styles = readSource("./slider.css");
const moduleBarrel = readSource("./index.ts");

test("forwards the complete Ark slider root contract and events", () => {
  assert.match(rootSource, /from "@ark-ui\/vue\/slider"/);
  assert.match(rootSource, /<ArkSlider\.Root/);
  assert.match(rootSource, /v-bind="\$attrs"/);
  assert.match(rootSource, /data-slot="slider"/);
  for (const prop of [
    "aria-label",
    "aria-labelledby",
    "asChild",
    "defaultValue",
    "dir",
    "disabled",
    "form",
    "getAriaValueText",
    "getRootNode",
    "id",
    "ids",
    "invalid",
    "largeStep",
    "max",
    "min",
    "minStepsBetweenThumbs",
    "modelValue",
    "name",
    "orientation",
    "origin",
    "readOnly",
    "step",
    "thumbAlignment",
    "thumbCollisionBehavior",
    "thumbSize",
  ]) {
    assert.match(
      rootSource,
      new RegExp(prop.includes("-") ? `props\\['${prop}'\\]` : `${prop}: undefined`),
    );
  }
  for (const event of [
    "focusChange",
    "update:modelValue",
    "valueChange",
    "valueChangeEnd",
  ]) {
    assert.match(rootSource, new RegExp(`emit\\('${event}'`));
  }
  assert.match(typesSource, /SliderFocusChangeDetails/);
  assert.match(typesSource, /SliderValueChangeDetails/);
});

test("renders every Ark part with a Kappa slot and forwards attributes", () => {
  for (const [name, source] of Object.entries(partSources)) {
    if (name === "SliderContext.vue") {
      assert.match(source, /<ArkSlider\.Context v-slot="context">/);
      continue;
    }
    assert.match(source, /v-bind="\$attrs"/, name);
    assert.match(source, /data-slot="slider-/, name);
    assert.match(source, /<slot/, name);
  }
  assert.match(providerSource, /<ArkSlider\.RootProvider/);
  assert.match(providerSource, /:value="props\.value"/);
  assert.match(partSources["SliderMarker.vue"], /:value="props\.value"/);
  assert.match(partSources["SliderThumb.vue"], /:index="props\.index"/);
});

test("exports the compound API, named parts, and Ark hooks", () => {
  for (const part of [
    "Root",
    "RootProvider",
    "Label",
    "ValueText",
    "Control",
    "Track",
    "Range",
    "Thumb",
    "HiddenInput",
    "MarkerGroup",
    "Marker",
    "DraggingIndicator",
    "Context",
  ]) {
    assert.match(moduleBarrel, new RegExp(`${part}: Slider${part}`));
    assert.match(moduleBarrel, new RegExp(`Slider${part}`));
  }
  assert.match(moduleBarrel, /SliderProps/);
  assert.match(moduleBarrel, /sliderAnatomy/);
  assert.match(moduleBarrel, /useSlider/);
  assert.match(moduleBarrel, /useSliderContext/);
});

test("uses Ark state attributes, semantic tokens, logical orientation, and complete states", () => {
  for (const token of [
    "--kappa-accent-solid",
    "--kappa-control",
    "--kappa-default",
    "--kappa-danger",
    "--kappa-focus",
    "--kappa-line",
    "--kappa-subtle",
  ]) {
    assert.match(styles, new RegExp(`var\\(${token}`));
  }
  for (const selector of [
    "data-disabled",
    "data-dragging",
    "data-focus",
    "data-invalid",
    "data-orientation",
    "data-readonly",
    "focus-visible",
    "forced-colors",
    "prefers-reduced-motion",
  ]) {
    assert.match(styles, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(rootSource, /data-readonly/);
  assert.match(styles, /inset-block: 0/);
  assert.match(styles, /grid-template-rows/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)/);
});
