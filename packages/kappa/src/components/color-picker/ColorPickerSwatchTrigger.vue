<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerSwatchTriggerProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerSwatchTriggerProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.SwatchTrigger v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__swatch-trigger" data-slot="color-picker-swatch-trigger"><slot /></ArkColorPicker.SwatchTrigger></template>
<style src="./color-picker.css"></style>
