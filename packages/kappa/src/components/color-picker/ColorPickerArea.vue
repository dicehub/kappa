<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerAreaProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerAreaProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.Area v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__area" data-slot="color-picker-area"><slot /></ArkColorPicker.Area></template>
<style src="./color-picker.css"></style>
