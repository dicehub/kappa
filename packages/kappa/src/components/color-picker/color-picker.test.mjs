import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (name) => readFileSync(new URL(name, import.meta.url), "utf8");
const root = readSource("./ColorPicker.vue");
const content = readSource("./ColorPickerContent.vue");
const channelInput = readSource("./ColorPickerChannelInput.vue");
const channelSlider = readSource("./ColorPickerChannelSlider.vue");
const swatchTrigger = readSource("./ColorPickerSwatchTrigger.vue");
const types = readSource("./color-picker.ts");
const barrel = readSource("./index.ts");
const styles = readSource("./color-picker.css");

test("forwards Ark root state, values, and events", () => {
  assert.match(root, /from "@ark-ui\/vue\/color-picker"/);
  assert.match(root, /v-bind="\{ \.\.\.\$attrs, \.\.\.forwardedProps \}"/);
  assert.match(root, /data-slot="color-picker"/);
  assert.match(root, /:data-size="resolvedSize"/);
  assert.match(root, /placement: "bottom-start"/);
  assert.match(root, /open: undefined/);
  assert.match(content, /present: undefined/);
  for (const event of ["formatChange", "openChange", "update:format", "update:modelValue", "update:open", "valueChange", "valueChangeEnd"]) {
    assert.match(root, new RegExp(`emit\\('${event}'`));
  }
  assert.match(types, /extends ArkColorPickerRootProps/);
  assert.match(types, /"sm", "base", "lg"/);
});

test("keeps native color-picker parts on Ark behavior", () => {
  assert.match(channelInput, /<ArkColorPicker\.ChannelInput/);
  assert.match(channelInput, /data-slot="color-picker-channel-input"/);
  assert.match(channelSlider, /<ArkColorPicker\.ChannelSlider/);
  assert.match(swatchTrigger, /<ArkColorPicker\.SwatchTrigger/);
  assert.match(content, /<Teleport/);
  assert.match(content, /<ArkColorPicker\.Positioner/);
  assert.match(content, /<ArkColorPicker\.Content/);
});

test("exports the compound component and Ark utilities", () => {
  for (const part of ["Root", "RootProvider", "Label", "Control", "ChannelInput", "Trigger", "ValueSwatch", "Content", "Area", "AreaBackground", "AreaThumb", "ChannelSlider", "ChannelSliderTrack", "ChannelSliderThumb", "SwatchGroup", "SwatchTrigger", "Swatch", "SwatchIndicator", "HiddenInput", "Context"]) {
    assert.match(barrel, new RegExp(`${part}: ColorPicker${part}`));
  }
  assert.match(barrel, /parseColor/);
  assert.match(barrel, /useColorPicker/);
  assert.match(barrel, /colorPickerAnatomy/);
});

test("uses Kappa tokens and complete interaction states", () => {
  assert.match(styles, /\.kappa-color-picker__content/);
  assert.match(styles, /var\(--kappa-line/);
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /z-index: var\(--kappa-color-picker-z-index, 1000\) !important/);
  assert.match(styles, /\.kappa-color-picker__content\[data-state="closed"\]\s*\{\s*display: none;/);
  assert.match(styles, /\[data-disabled\]/);
  assert.match(styles, /\[data-invalid\]/);
  assert.match(styles, /\[data-readonly\]/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /^\s*\.(?!kappa-)[a-z][\w-]*/m);
  assert.doesNotMatch(styles, /(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
  assert.doesNotMatch(styles, /(?:margin|padding|border)-(?:left|right)|text-align:\s*(?:left|right)/);
  assert.doesNotMatch(styles, /#[\da-f]{3,8}(?![^\n]*\))/i);
});
