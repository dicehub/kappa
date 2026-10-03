<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerContextSlots } from "./color-picker";
defineSlots<ColorPickerContextSlots>();
</script>
<template><ArkColorPicker.Context v-slot="context"><slot v-bind="context" /></ArkColorPicker.Context></template>
