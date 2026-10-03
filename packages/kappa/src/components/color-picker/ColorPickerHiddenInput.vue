<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerHiddenInputProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerHiddenInputProps>();
</script>
<template><ArkColorPicker.HiddenInput v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__hidden-input" data-slot="color-picker-hidden-input" /></template>
<style src="./color-picker.css"></style>
