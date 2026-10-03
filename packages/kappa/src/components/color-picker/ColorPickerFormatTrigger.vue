<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerFormatTriggerProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerFormatTriggerProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.FormatTrigger v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__format-trigger" data-slot="color-picker-format-trigger"><slot /></ArkColorPicker.FormatTrigger></template>
<style src="./color-picker.css"></style>
