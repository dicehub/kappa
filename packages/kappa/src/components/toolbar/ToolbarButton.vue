<script setup lang="ts">
import { computed, mergeProps, useAttrs, useId, useSlots } from "vue";
import Button from "../button/Button.vue";
import { Tooltip } from "../tooltip";
import { useToolbarContext } from "./context";
import {
  resolveToolbarButtonSize,
  resolveToolbarButtonVariant,
  type ToolbarButtonProps,
  type ToolbarButtonSlots,
} from "../button/toolbar-button";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToolbarButtonProps>(), {
  disabled: false,
  icon: undefined,
  iconProps: undefined,
  loading: false,
  shape: undefined,
  size: undefined,
  tooltip: undefined,
  tooltipPlacement: "bottom",
  type: "button",
  variant: undefined,
});

defineSlots<ToolbarButtonSlots>();

const slots = useSlots();
const attrs = useAttrs();
const toolbar = useToolbarContext();
const triggerId = useId();

const resolvedSize = computed(() => toolbar?.size.value ?? resolveToolbarButtonSize(props.size));
const resolvedVariant = computed(() => toolbar ? "ghost" : resolveToolbarButtonVariant(props.variant));
const resolvedShape = computed(() =>
  props.shape ?? (!slots.default && props.icon ? "square" : "base"),
);
const nativeDisabled = computed(
  () => props.loading || props.disabled || Boolean(toolbar?.disabled.value),
);
const buttonProps = computed(() => ({
  class: toolbar ? "kappa-toolbar__item kappa-toolbar__button" : "kappa-toolbar-button",
  "data-kappa-component": toolbar ? "Toolbar.Button" : "ToolbarButton",
  "data-kappa-toolbar-item": toolbar ? "" : undefined,
  disabled: nativeDisabled.value,
  fullWidth: props.fullWidth,
  icon: props.icon,
  iconPosition: props.iconPosition,
  iconProps: props.iconProps,
  loading: props.loading,
  shape: resolvedShape.value,
  size: resolvedSize.value,
  title: props.tooltip ? undefined : props.title,
  type: props.type,
  variant: resolvedVariant.value,
}));

// Attributes change with an outer trigger. Read them during each render.
function getButtonProps() {
  return mergeProps(attrs, buttonProps.value, {
    "aria-label": attrs["aria-label"] ?? (
      props.tooltip && props.icon && !slots.default && !attrs["aria-labelledby"]
        ? props.tooltip
        : undefined
    ),
  });
}
</script>

<template>
  <Tooltip.Root
    v-if="props.tooltip"
    :ids="{ trigger: typeof $attrs.id === 'string' ? $attrs.id : triggerId }"
    :disabled="nativeDisabled || $attrs['aria-expanded'] === true || $attrs['aria-expanded'] === 'true'"
    :open-delay="500"
    :close-delay="0"
    :positioning="{ placement: props.tooltipPlacement, strategy: 'fixed' }"
  >
    <Tooltip.Trigger as-child>
      <Button v-bind="getButtonProps()">
        <template v-if="$slots.default" #default><slot /></template>
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>{{ props.tooltip }}</Tooltip.Content>
  </Tooltip.Root>
  <Button v-else v-bind="getButtonProps()">
    <template v-if="$slots.default" #default><slot /></template>
  </Button>
</template>

<style src="../button/toolbar-button.css"></style>
