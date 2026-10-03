<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import { computed } from "vue";
import {
  COLOR_PICKER_DEFAULT_SIZE,
  resolveColorPickerSize,
  type ColorPickerEmits,
  type ColorPickerProps,
  type ColorPickerRootSlots,
} from "./color-picker";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ColorPickerProps>(), {
  asChild: undefined,
  closeOnSelect: undefined,
  defaultOpen: undefined,
  disabled: undefined,
  inline: undefined,
  invalid: undefined,
  lazyMount: undefined,
  open: undefined,
  openAutoFocus: undefined,
  positioning: () => ({ gutter: 4, overflowPadding: 8, placement: "bottom-start" }),
  readOnly: undefined,
  required: undefined,
  size: COLOR_PICKER_DEFAULT_SIZE,
  unmountOnExit: undefined,
});
const emit = defineEmits<ColorPickerEmits>();
defineSlots<ColorPickerRootSlots>();

const forwardedProps = computed(() => {
  const { size: _size, ...rest } = props;
  return rest;
});
const resolvedSize = computed(() => resolveColorPickerSize(props.size));
</script>

<template>
  <ArkColorPicker.Root
    v-bind="{ ...$attrs, ...forwardedProps }"
    class="kappa-color-picker"
    data-slot="color-picker"
    :data-readonly="props.readOnly ? '' : undefined"
    :data-size="resolvedSize"
    @exit-complete="emit('exitComplete')"
    @focus-outside="emit('focusOutside', $event)"
    @format-change="emit('formatChange', $event)"
    @interact-outside="emit('interactOutside', $event)"
    @open-change="emit('openChange', $event)"
    @pointer-down-outside="emit('pointerDownOutside', $event)"
    @update:format="emit('update:format', $event)"
    @update:model-value="emit('update:modelValue', $event)"
    @update:open="emit('update:open', $event)"
    @value-change="emit('valueChange', $event)"
    @value-change-end="emit('valueChangeEnd', $event)"
  >
    <slot />
  </ArkColorPicker.Root>
</template>

<style src="./color-picker.css"></style>
