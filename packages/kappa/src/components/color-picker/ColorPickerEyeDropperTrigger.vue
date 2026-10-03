<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerEyeDropperTriggerProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerEyeDropperTriggerProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.EyeDropperTrigger v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__eye-dropper-trigger" data-slot="color-picker-eye-dropper-trigger"><slot /></ArkColorPicker.EyeDropperTrigger></template>
<style src="./color-picker.css"></style>
