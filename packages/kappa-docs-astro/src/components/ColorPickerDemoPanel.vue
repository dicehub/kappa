<script setup lang="ts">
import {
  ColorPicker,
  parseColor,
  type ColorPickerSize,
} from "@dicehub/kappa/components/color-picker";

const props = withDefaults(
  defineProps<{
    inline?: boolean;
    label?: string;
    showPresets?: boolean;
    size?: ColorPickerSize;
    value?: string;
  }>(),
  {
    inline: false,
    label: "Accent color",
    showPresets: true,
    size: "base",
    value: "#3f5fdb",
  },
);

const swatches = ["#3f5fdb", "#157f6f", "#b54708", "#b42318", "#7a5af8", "#344054"];
</script>

<template>
  <ColorPicker.Root
    default-format="hsba"
    :default-value="parseColor(props.value)"
    :inline="props.inline"
    :size="props.size"
  >
    <ColorPicker.Label>{{ props.label }}</ColorPicker.Label>
    <ColorPicker.Control>
      <ColorPicker.ChannelInput channel="hex" aria-label="Hex color" />
      <ColorPicker.Trigger aria-label="Open color picker">
        <ColorPicker.ValueSwatch />
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m5 6.5 3 3 3-3" />
        </svg>
      </ColorPicker.Trigger>
    </ColorPicker.Control>
    <ColorPicker.HiddenInput />
    <ColorPicker.Content :teleport="!props.inline">
      <ColorPicker.Area>
        <ColorPicker.AreaBackground />
        <ColorPicker.AreaThumb />
      </ColorPicker.Area>

      <ColorPicker.ChannelSlider channel="hue">
        <ColorPicker.ChannelSliderLabel>Hue</ColorPicker.ChannelSliderLabel>
        <ColorPicker.ChannelSliderValueText />
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>

      <ColorPicker.ChannelSlider channel="alpha">
        <ColorPicker.ChannelSliderLabel>Opacity</ColorPicker.ChannelSliderLabel>
        <ColorPicker.ChannelSliderValueText />
        <ColorPicker.TransparencyGrid size="8px" />
        <ColorPicker.ChannelSliderTrack />
        <ColorPicker.ChannelSliderThumb />
      </ColorPicker.ChannelSlider>

      <ColorPicker.View format="hsba">
        <ColorPicker.ChannelInput channel="hex" aria-label="Hex value" />
        <ColorPicker.ChannelInput channel="alpha" aria-label="Alpha value" />
      </ColorPicker.View>

      <ColorPicker.SwatchGroup v-if="props.showPresets" aria-label="Preset colors">
        <ColorPicker.SwatchTrigger v-for="swatch in swatches" :key="swatch" :value="swatch">
          <ColorPicker.Swatch :value="swatch"><ColorPicker.SwatchIndicator /></ColorPicker.Swatch>
        </ColorPicker.SwatchTrigger>
      </ColorPicker.SwatchGroup>
    </ColorPicker.Content>
  </ColorPicker.Root>
</template>

<style scoped>
.kappa-color-picker__trigger svg {
  inline-size: 0.875rem;
  block-size: 0.875rem;
  margin-inline-start: 0.25rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}
</style>
