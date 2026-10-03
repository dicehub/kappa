<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerValueSwatchProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerValueSwatchProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.ValueSwatch v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__value-swatch" data-slot="color-picker-value-swatch"><slot /></ArkColorPicker.ValueSwatch></template>
<style src="./color-picker.css"></style>
