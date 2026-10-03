<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerAreaThumbProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerAreaThumbProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.AreaThumb v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__area-thumb" data-slot="color-picker-area-thumb"><slot /></ArkColorPicker.AreaThumb></template>
<style src="./color-picker.css"></style>
