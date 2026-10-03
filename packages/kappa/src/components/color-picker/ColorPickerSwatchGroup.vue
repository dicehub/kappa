<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerSwatchGroupProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerSwatchGroupProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.SwatchGroup v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__swatch-group" data-slot="color-picker-swatch-group"><slot /></ArkColorPicker.SwatchGroup></template>
<style src="./color-picker.css"></style>
