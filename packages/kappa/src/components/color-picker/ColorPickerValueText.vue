<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerPartSlots, ColorPickerValueTextProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerValueTextProps>(); defineSlots<ColorPickerPartSlots>();
</script>
<template>
  <ArkColorPicker.ValueText v-if="$slots.default" v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__value-text" data-slot="color-picker-value-text"><slot /></ArkColorPicker.ValueText>
  <ArkColorPicker.ValueText v-else v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__value-text" data-slot="color-picker-value-text" />
</template>
<style src="./color-picker.css"></style>
