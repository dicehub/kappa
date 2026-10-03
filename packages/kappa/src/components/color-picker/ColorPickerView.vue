<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerViewProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerViewProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.View v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__view" data-slot="color-picker-view"><slot /></ArkColorPicker.View></template>
<style src="./color-picker.css"></style>
