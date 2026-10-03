<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerChannelSliderValueTextProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerChannelSliderValueTextProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template>
  <ArkColorPicker.ChannelSliderValueText v-if="$slots.default" v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__channel-slider-value-text" data-slot="color-picker-channel-slider-value-text"><slot /></ArkColorPicker.ChannelSliderValueText>
  <ArkColorPicker.ChannelSliderValueText v-else v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__channel-slider-value-text" data-slot="color-picker-channel-slider-value-text" />
</template>
<style src="./color-picker.css"></style>
