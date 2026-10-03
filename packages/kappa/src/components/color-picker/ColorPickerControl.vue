<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerControlProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerControlProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.Control v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__control" data-slot="color-picker-control"><slot /></ArkColorPicker.Control></template>
<style src="./color-picker.css"></style>
