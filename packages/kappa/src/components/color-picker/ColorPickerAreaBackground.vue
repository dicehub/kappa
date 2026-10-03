<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerAreaBackgroundProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerAreaBackgroundProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template><ArkColorPicker.AreaBackground v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__area-background" data-slot="color-picker-area-background"><slot /></ArkColorPicker.AreaBackground></template>
<style src="./color-picker.css"></style>
