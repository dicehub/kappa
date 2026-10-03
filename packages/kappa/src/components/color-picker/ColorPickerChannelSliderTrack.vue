<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerChannelSliderTrackProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerChannelSliderTrackProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.ChannelSliderTrack v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__channel-slider-track" data-slot="color-picker-channel-slider-track"><slot /></ArkColorPicker.ChannelSliderTrack></template>
<style src="./color-picker.css"></style>
