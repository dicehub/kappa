<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerSwatchIndicatorProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerSwatchIndicatorProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.SwatchIndicator v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__swatch-indicator" data-slot="color-picker-swatch-indicator"><slot><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8.25 2.75 2.75 6.25-6.25" /></svg></slot></ArkColorPicker.SwatchIndicator></template>
<style src="./color-picker.css"></style>
