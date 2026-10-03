<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import { computed } from "vue";
import { COLOR_PICKER_DEFAULT_SIZE, resolveColorPickerSize, type ColorPickerRootProviderProps, type ColorPickerRootSlots } from "./color-picker";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ColorPickerRootProviderProps>(), {
  asChild: undefined,
  lazyMount: undefined,
  size: COLOR_PICKER_DEFAULT_SIZE,
  unmountOnExit: undefined,
});
defineSlots<ColorPickerRootSlots>();
const forwardedProps = computed(() => { const { size: _size, ...rest } = props; return rest; });
</script>
<template><ArkColorPicker.RootProvider v-bind="{ ...$attrs, ...forwardedProps }" class="kappa-color-picker" data-slot="color-picker" :data-size="resolveColorPickerSize(props.size)"><slot /></ArkColorPicker.RootProvider></template>
<style src="./color-picker.css"></style>
