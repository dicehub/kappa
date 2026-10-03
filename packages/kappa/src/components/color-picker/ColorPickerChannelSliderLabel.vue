<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerChannelSliderLabelProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerChannelSliderLabelProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.ChannelSliderLabel v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__channel-slider-label" data-slot="color-picker-channel-slider-label"><slot /></ArkColorPicker.ChannelSliderLabel></template>
<style src="./color-picker.css"></style>
