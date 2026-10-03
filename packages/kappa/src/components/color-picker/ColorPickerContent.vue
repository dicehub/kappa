<script setup lang="ts">
import { ColorPicker as ArkColorPicker, useColorPickerContext } from "@ark-ui/vue/color-picker";
import { computed, onMounted, ref } from "vue";
import type { ColorPickerContentProps, ColorPickerPartSlots } from "./color-picker";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ColorPickerContentProps>(), {
  asChild: undefined,
  immediate: undefined,
  lazyMount: undefined,
  present: undefined,
  skipAnimationOnMount: undefined,
  teleport: true,
  teleportTo: "body",
  unmountOnExit: undefined,
});
defineSlots<ColorPickerPartSlots>();
const mounted = ref(false);
onMounted(() => { mounted.value = true; });
const contentProps = computed(() => { const { teleport: _teleport, teleportTo: _teleportTo, ...rest } = props; return rest; });
const colorPicker = useColorPickerContext();
</script>
<template>
  <ArkColorPicker.Content v-if="colorPicker.inline" v-bind="{ ...$attrs, ...contentProps }" class="kappa-color-picker__content kappa-color-picker__content--inline" data-slot="color-picker-content"><slot /></ArkColorPicker.Content>
  <Teleport v-else :disabled="!props.teleport || !mounted" :to="props.teleportTo">
    <ArkColorPicker.Positioner class="kappa-color-picker__positioner" data-slot="color-picker-positioner">
      <ArkColorPicker.Content v-bind="{ ...$attrs, ...contentProps }" class="kappa-color-picker__content" data-slot="color-picker-content"><slot /></ArkColorPicker.Content>
    </ArkColorPicker.Positioner>
  </Teleport>
</template>
<style src="./color-picker.css"></style>
