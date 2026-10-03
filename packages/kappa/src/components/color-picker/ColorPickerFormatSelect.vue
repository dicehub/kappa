<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerFormatSelectProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerFormatSelectProps>();
</script>
<template><ArkColorPicker.FormatSelect v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__format-select" data-slot="color-picker-format-select" /></template>
<style src="./color-picker.css"></style>
