<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerChannelSliderThumbProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerChannelSliderThumbProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.ChannelSliderThumb v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__channel-slider-thumb" data-slot="color-picker-channel-slider-thumb"><slot /></ArkColorPicker.ChannelSliderThumb></template>
<style src="./color-picker.css"></style>
