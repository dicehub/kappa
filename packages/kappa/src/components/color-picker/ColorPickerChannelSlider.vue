<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerChannelSliderProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerChannelSliderProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.ChannelSlider v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__channel-slider" data-slot="color-picker-channel-slider"><slot /></ArkColorPicker.ChannelSlider></template>
<style src="./color-picker.css"></style>
