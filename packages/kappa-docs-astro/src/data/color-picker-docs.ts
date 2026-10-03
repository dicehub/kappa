const vueTemplate = (source: string) =>
  `<template>\n${source.replace(/^/gm, "  ")}\n</template>`;

export const barrelCode = `import { ColorPicker, parseColor } from "@dicehub/kappa";`;
export const granularCode = `import { ColorPicker, parseColor } from "@dicehub/kappa/components/color-picker";`;

export const usageCode = `<script setup>
import { ColorPicker, parseColor } from "@dicehub/kappa/components/color-picker";
</script>

<template>
  <ColorPicker.Root default-format="hsba" :default-value="parseColor('#3f5fdb')">
    <ColorPicker.Label>Accent color</ColorPicker.Label>
    <ColorPicker.Control>
      <ColorPicker.ChannelInput channel="hex" aria-label="Hex color" />
      <ColorPicker.Trigger aria-label="Open color picker">
        <ColorPicker.ValueSwatch />
      </ColorPicker.Trigger>
    </ColorPicker.Control>
    <ColorPicker.HiddenInput name="accent" />
    <ColorPicker.Content>
      <ColorPicker.Area>
        <ColorPicker.AreaBackground />
        <ColorPicker.AreaThumb />
      </ColorPicker.Area>
      <ColorPicker.ChannelSlider channel="hue">
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>
      <ColorPicker.ChannelSlider channel="alpha">
        <ColorPicker.TransparencyGrid size="8px" />
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>
    </ColorPicker.Content>
  </ColorPicker.Root>
</template>`;

export const inlineCode = vueTemplate(`<ColorPicker.Root inline default-format="hsba" :default-value="parseColor('#157f6f')">
  <ColorPicker.Label>Surface color</ColorPicker.Label>
  <ColorPicker.Content :teleport="false">
    <ColorPicker.Area>
      <ColorPicker.AreaBackground />
      <ColorPicker.AreaThumb />
    </ColorPicker.Area>
    <!-- Add channel sliders and inputs. -->
  </ColorPicker.Content>
</ColorPicker.Root>`);

export const inputCode = vueTemplate(`<ColorPicker.Root :default-value="parseColor('#b54708')">
  <ColorPicker.Label>Annotation color</ColorPicker.Label>
  <ColorPicker.Control>
    <ColorPicker.ChannelInput channel="hex" aria-label="Annotation color in hexadecimal" />
    <ColorPicker.Trigger aria-label="Color preview"><ColorPicker.ValueSwatch /></ColorPicker.Trigger>
  </ColorPicker.Control>
  <ColorPicker.HiddenInput name="annotation-color" />
</ColorPicker.Root>`);

export const sizesCode = vueTemplate(`<ColorPicker.Root size="sm" :default-value="parseColor('#157f6f')">
  <ColorPicker.Control>…</ColorPicker.Control>
  <ColorPicker.Content>…</ColorPicker.Content>
</ColorPicker.Root>
<ColorPicker.Root size="base" :default-value="parseColor('#3f5fdb')">
  <ColorPicker.Control>…</ColorPicker.Control>
  <ColorPicker.Content>…</ColorPicker.Content>
</ColorPicker.Root>
<ColorPicker.Root size="lg" :default-value="parseColor('#b54708')">
  <ColorPicker.Control>…</ColorPicker.Control>
  <ColorPicker.Content>…</ColorPicker.Content>
</ColorPicker.Root>`);

export const statesCode = vueTemplate(`<ColorPicker.Root disabled :default-value="parseColor('#667085')">…</ColorPicker.Root>
<ColorPicker.Root read-only :default-value="parseColor('#157f6f')">…</ColorPicker.Root>
<ColorPicker.Root invalid :default-value="parseColor('#b42318')">…</ColorPicker.Root>`);

export const rootProps = [
  { name: "defaultValue / modelValue", type: "Color", defaultValue: 'parseColor("#000000") / —', description: "Initial or controlled color value." },
  { name: "defaultFormat / format", type: '"rgba" | "hsla" | "hsba"', defaultValue: '"rgba"', description: "Initial or controlled channel format." },
  { name: "defaultOpen / open", type: "boolean", defaultValue: "false / —", description: "Initial or controlled popover state." },
  { name: "inline", type: "boolean", defaultValue: "false", description: "Keeps the picker content in the document flow." },
  { name: "closeOnSelect", type: "boolean", defaultValue: "false", description: "Closes the popover after a swatch selection." },
  { name: "disabled / readOnly / invalid / required", type: "boolean", defaultValue: "false", description: "Form and interaction states owned by Ark UI." },
  { name: "name", type: "string", defaultValue: "—", description: "Name used by HiddenInput for native form submission." },
  { name: "positioning", type: "PositioningOptions", defaultValue: 'bottom-start, 4px gutter', description: "Floating content placement and collision options." },
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Selects Kappa control geometry." },
] as const;

export const parts = [
  { name: "Root / RootProvider", element: "div", description: "Owns the color, format, popover, and form state." },
  { name: "Label / Control", element: "label / div", description: "Names and groups the input and trigger." },
  { name: "ChannelInput", element: "input", description: "Edits a color channel, hexadecimal value, or CSS color." },
  { name: "Trigger / ValueSwatch / ValueText", element: "button / span", description: "Opens the popover and presents the current value." },
  { name: "Content", element: "div", description: "Token-styled, teleported popover surface." },
  { name: "Area / AreaBackground / AreaThumb", element: "div", description: "Two-axis color selection surface." },
  { name: "ChannelSlider / Track / Thumb", element: "div", description: "Single-channel pointer and keyboard control." },
  { name: "FormatSelect / FormatTrigger / View", element: "select / button / div", description: "Switches and groups color formats." },
  { name: "SwatchGroup / SwatchTrigger / Swatch / SwatchIndicator", element: "div / button", description: "Preset color choices and selected state." },
  { name: "TransparencyGrid / EyeDropperTrigger", element: "div / button", description: "Alpha backdrop and browser eye-dropper action." },
  { name: "HiddenInput / Context", element: "input / slot", description: "Native form value and renderless Ark API." },
] as const;

export const events = [
  { name: "update:modelValue / valueChange", payload: "Color / ColorPickerValueChangeDetails", description: "Reports color changes during interaction." },
  { name: "valueChangeEnd", payload: "ColorPickerValueChangeDetails", description: "Reports the end of a drag or keyboard change." },
  { name: "update:open / openChange", payload: "boolean / ColorPickerOpenChangeDetails", description: "Reports popover state changes." },
  { name: "update:format / formatChange", payload: "ColorFormat / ColorPickerFormatChangeDetails", description: "Reports format changes." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"color-picker" and part names', description: "Stable Kappa selectors for the root and parts." },
  { name: "data-state", value: '"open" | "closed" | "checked"', description: "Popover and selected-swatch state." },
  { name: "data-disabled / data-invalid / data-readonly", value: "present", description: "Interaction and validation states." },
  { name: "data-size", value: '"sm" | "base" | "lg"', description: "Resolved Kappa control size." },
  { name: "data-channel", value: "color channel", description: "Channel identity on inputs and sliders." },
] as const;

export const exportsList = [
  { name: "ColorPicker", description: "Compound Ark-backed color selection control." },
  { name: "ColorPickerRoot / Content / Control / Area / ChannelSlider", description: "Named root, popup, and selection parts." },
  { name: "ColorPickerSwatch* / ChannelInput / Format*", description: "Preset, input, and format parts." },
  { name: "ColorPickerProps / ColorPickerEmits / *Props", description: "Public Vue contracts." },
  { name: "ColorPickerSize / COLOR_PICKER_*", description: "Kappa geometry options and defaults." },
  { name: "parseColor / useColorPicker / useColorPickerContext / colorPickerAnatomy", description: "Ark UI color and composition utilities." },
] as const;
