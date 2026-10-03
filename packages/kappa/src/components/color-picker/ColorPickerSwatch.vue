<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerSwatchProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerSwatchProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.Swatch v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__swatch" data-slot="color-picker-swatch"><slot /></ArkColorPicker.Swatch></template>
<style src="./color-picker.css"></style>
