<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { InputGroup } from "../input-group";
import { useToolbarContext } from "./context";
import {
  TOOLBAR_DEFAULT_SIZE,
  type ToolbarInputGroupProps,
  type ToolbarInputGroupSlots,
} from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToolbarInputGroupProps>(), {
  disabled: false,
  invalid: false,
});

defineSlots<ToolbarInputGroupSlots>();

const attrs = useAttrs();
const toolbar = useToolbarContext();
const resolvedSize = computed(() => toolbar?.size.value ?? TOOLBAR_DEFAULT_SIZE);
const nativeDisabled = computed(
  () => props.disabled || Boolean(toolbar?.disabled.value),
);
const groupAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== "size"),
  ),
);
</script>

<template>
  <InputGroup
    v-bind="groupAttrs"
    class="kappa-toolbar__item kappa-toolbar__input-group"
    data-kappa-component="Toolbar.InputGroup"
    data-kappa-toolbar-item=""
    data-kappa-toolbar-input-group=""
    :disabled="nativeDisabled"
    :invalid="props.invalid"
    :size="resolvedSize"
  >
    <slot />
  </InputGroup>
</template>
