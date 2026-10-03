<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { Input } from "../input";
import { useToolbarContext } from "./context";
import {
  TOOLBAR_DEFAULT_SIZE,
  type ToolbarInputComponentProps,
  type ToolbarInputEmits,
  type ToolbarInputSlots,
} from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToolbarInputComponentProps>(), {
  disabled: false,
  invalid: false,
  modelValue: undefined,
  passwordManagerIgnore: false,
});

const emit = defineEmits<ToolbarInputEmits>();
defineSlots<ToolbarInputSlots>();

const attrs = useAttrs();
const toolbar = useToolbarContext();
const resolvedSize = computed(() => toolbar?.size.value ?? TOOLBAR_DEFAULT_SIZE);
const nativeDisabled = computed(
  () => props.disabled || Boolean(toolbar?.disabled.value),
);
const inputAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) => key !== "size",
    ),
  ),
);

const handleUpdate = (value: string) => {
  emit("update:modelValue", value);
  emit("valueChange", value);
};
</script>

<template>
  <Input
    v-bind="inputAttrs"
    class="kappa-toolbar__item kappa-toolbar__input"
    data-kappa-component="Toolbar.Input"
    data-kappa-toolbar-item=""
    :disabled="nativeDisabled"
    :invalid="props.invalid"
    :model-value="props.modelValue"
    :password-manager-ignore="props.passwordManagerIgnore"
    :size="resolvedSize"
    @update:model-value="handleUpdate"
  />
</template>
