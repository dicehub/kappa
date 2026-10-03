<script setup lang="ts">
import { ColorPicker, parseColor } from "@dicehub/kappa/components/color-picker";
import { ref } from "vue";
import ColorPickerDemoPanel from "./ColorPickerDemoPanel.vue";

type DemoVariant = "preview" | "usage" | "inline" | "input" | "sizes" | "states";
const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });
const controlled = ref(parseColor("#3f5fdb"));
const sizeValues = { sm: "#157f6f", base: "#3f5fdb", lg: "#b54708" } as const;
</script>

<template>
  <div class="color-picker-demo" :data-color-picker-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="color-picker-demo__stack">
      <ColorPicker.Root v-model="controlled" default-format="hsba">
        <ColorPicker.Label>Accent color</ColorPicker.Label>
        <ColorPicker.Control>
          <ColorPicker.ChannelInput channel="hex" aria-label="Hex color" />
          <ColorPicker.Trigger aria-label="Open color picker">
            <ColorPicker.ValueSwatch />
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m5 6.5 3 3 3-3" /></svg>
          </ColorPicker.Trigger>
        </ColorPicker.Control>
        <ColorPicker.HiddenInput name="accent" />
        <ColorPicker.Content>
          <ColorPicker.Area><ColorPicker.AreaBackground /><ColorPicker.AreaThumb /></ColorPicker.Area>
          <ColorPicker.ChannelSlider channel="hue">
            <ColorPicker.ChannelSliderLabel>Hue</ColorPicker.ChannelSliderLabel>
            <ColorPicker.ChannelSliderValueText />
            <ColorPicker.ChannelSliderTrack /><ColorPicker.ChannelSliderThumb />
          </ColorPicker.ChannelSlider>
          <ColorPicker.ChannelSlider channel="alpha">
            <ColorPicker.ChannelSliderLabel>Opacity</ColorPicker.ChannelSliderLabel>
            <ColorPicker.ChannelSliderValueText />
            <ColorPicker.TransparencyGrid size="8px" />
            <ColorPicker.ChannelSliderTrack /><ColorPicker.ChannelSliderThumb />
          </ColorPicker.ChannelSlider>
        </ColorPicker.Content>
      </ColorPicker.Root>
      <output role="status">{{ controlled.toString("hex") }}</output>
    </div>

    <ColorPickerDemoPanel v-else-if="props.variant === 'usage'" />
    <ColorPickerDemoPanel v-else-if="props.variant === 'inline'" inline label="Surface color" value="#157f6f" />

    <ColorPicker.Root v-else-if="props.variant === 'input'" :default-value="parseColor('#b54708')">
      <ColorPicker.Label>Annotation color</ColorPicker.Label>
      <ColorPicker.Control>
        <ColorPicker.ChannelInput channel="hex" aria-label="Annotation color in hexadecimal" />
        <ColorPicker.Trigger aria-label="Color preview"><ColorPicker.ValueSwatch /></ColorPicker.Trigger>
      </ColorPicker.Control>
      <ColorPicker.HiddenInput name="annotation-color" />
    </ColorPicker.Root>

    <div v-else-if="props.variant === 'sizes'" class="color-picker-demo__sizes">
      <ColorPickerDemoPanel
        v-for="size in (['sm', 'base', 'lg'] as const)"
        :key="size"
        :label="size"
        :show-presets="false"
        :size="size"
        :value="sizeValues[size]"
      />
    </div>

    <div v-else class="color-picker-demo__states">
      <ColorPicker.Root disabled :default-value="parseColor('#667085')">
        <ColorPicker.Label>Disabled</ColorPicker.Label>
        <ColorPicker.Control><ColorPicker.ChannelInput channel="hex" /><ColorPicker.Trigger><ColorPicker.ValueSwatch /></ColorPicker.Trigger></ColorPicker.Control>
      </ColorPicker.Root>
      <ColorPicker.Root read-only :default-value="parseColor('#157f6f')">
        <ColorPicker.Label>Read only</ColorPicker.Label>
        <ColorPicker.Control><ColorPicker.ChannelInput channel="hex" /><ColorPicker.Trigger><ColorPicker.ValueSwatch /></ColorPicker.Trigger></ColorPicker.Control>
      </ColorPicker.Root>
      <ColorPicker.Root invalid :default-value="parseColor('#b42318')">
        <ColorPicker.Label>Invalid</ColorPicker.Label>
        <ColorPicker.Control><ColorPicker.ChannelInput channel="hex" /><ColorPicker.Trigger><ColorPicker.ValueSwatch /></ColorPicker.Trigger></ColorPicker.Control>
      </ColorPicker.Root>
    </div>
  </div>
</template>

<style scoped>
.color-picker-demo { display: grid; inline-size: 100%; min-inline-size: 0; min-block-size: 10rem; place-items: center; color: var(--kappa-default, #17191f); font-family: var(--kappa-font-sans, inherit); }
.color-picker-demo__stack { display: grid; gap: 0.75rem; }
.color-picker-demo__stack output { color: var(--kappa-subtle, #6c7480); font-family: var(--kappa-font-mono, ui-monospace, monospace); font-size: 0.75rem; }
.color-picker-demo__sizes, .color-picker-demo__states { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.color-picker-demo :deep(.kappa-color-picker__trigger svg) { inline-size: 0.875rem; block-size: 0.875rem; margin-inline-start: 0.25rem; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.5; }
@media (max-width: 42rem) { .color-picker-demo__sizes, .color-picker-demo__states { grid-template-columns: minmax(0, 1fr); } }
</style>
