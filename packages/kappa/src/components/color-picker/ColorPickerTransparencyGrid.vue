<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerTransparencyGridProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerTransparencyGridProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.TransparencyGrid v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__transparency-grid" data-slot="color-picker-transparency-grid"><slot /></ArkColorPicker.TransparencyGrid></template>
<style src="./color-picker.css"></style>
