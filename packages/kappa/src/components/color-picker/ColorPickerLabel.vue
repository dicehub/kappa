<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerLabelProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerLabelProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.Label v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__label" data-slot="color-picker-label"><slot /></ArkColorPicker.Label></template>
<style src="./color-picker.css"></style>
