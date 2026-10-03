<script setup lang="ts">
import { computed, useAttrs, useSlots } from "vue";
import { Button } from "../button";
import { useToolbarContext } from "./context";
import {
  TOOLBAR_DEFAULT_SIZE,
  type ToolbarButtonProps,
  type ToolbarButtonSlots,
} from "./toolbar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToolbarButtonProps>(), {
  disabled: false,
  icon: undefined,
  iconProps: undefined,
  loading: false,
  shape: undefined,
  type: "button",
});

defineSlots<ToolbarButtonSlots>();

const attrs = useAttrs();
const slots = useSlots();
const toolbar = useToolbarContext();

const resolvedSize = computed(() => toolbar?.size.value ?? TOOLBAR_DEFAULT_SIZE);
const resolvedShape = computed(() =>
  props.shape ?? (!slots.default && props.icon ? "square" : "base"),
);
const nativeDisabled = computed(
  () => props.loading || props.disabled || Boolean(toolbar?.disabled.value),
);
const buttonAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) =>
        !["size", "variant"].includes(key),
    ),
  ),
);
</script>

<template>
  <Button
    v-bind="buttonAttrs"
    class="kappa-toolbar__item kappa-toolbar__button"
    data-kappa-component="Toolbar.Button"
    data-kappa-toolbar-item=""
    :disabled="nativeDisabled"
    :full-width="props.fullWidth"
    :icon="props.icon"
    :icon-position="props.iconPosition"
    :icon-props="props.iconProps"
    :loading="props.loading"
    :shape="resolvedShape"
    :size="resolvedSize"
    :title="props.title"
    :type="props.type"
    variant="ghost"
  >
    <slot />
  </Button>
</template>
