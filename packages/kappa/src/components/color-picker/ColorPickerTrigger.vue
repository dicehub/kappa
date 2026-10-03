<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerTriggerProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerTriggerProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.Trigger v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__trigger" data-slot="color-picker-trigger"><slot /></ArkColorPicker.Trigger></template>
<style src="./color-picker.css"></style>
