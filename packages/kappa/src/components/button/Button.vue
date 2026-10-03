<script setup lang="ts">
import { computed, onMounted, useAttrs } from "vue";
import {
  BUTTON_DEFAULT_ICON_POSITION,
  BUTTON_DEFAULT_SHAPE,
  BUTTON_DEFAULT_SIZE,
  BUTTON_DEFAULT_TYPE,
  BUTTON_DEFAULT_VARIANT,
  resolveButtonIconPosition,
  resolveButtonShape,
  resolveButtonSize,
  resolveButtonType,
  resolveButtonVariant,
  type ButtonProps,
  type ButtonSlots,
} from "./button";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  fullWidth: false,
  icon: undefined,
  iconPosition: BUTTON_DEFAULT_ICON_POSITION,
  iconProps: undefined,
  loading: false,
  shape: BUTTON_DEFAULT_SHAPE,
  size: BUTTON_DEFAULT_SIZE,
  title: undefined,
  type: BUTTON_DEFAULT_TYPE,
  variant: BUTTON_DEFAULT_VARIANT,
});

const slots = defineSlots<ButtonSlots>();
const attrs = useAttrs();

const resolvedVariant = computed(() => resolveButtonVariant(props.variant));
const resolvedSize = computed(() => resolveButtonSize(props.size));
const resolvedShape = computed(() => resolveButtonShape(props.shape));
const resolvedIconPosition = computed(() =>
  resolveButtonIconPosition(props.iconPosition),
);
const resolvedType = computed(() => resolveButtonType(props.type));
const resolvedTitle = computed(() =>
  props.title === undefined ? undefined : String(props.title),
);

onMounted(() => {
  if (
    props.icon &&
    !slots.default &&
    !attrs["aria-label"] &&
    !attrs["aria-labelledby"]
  ) {
    console.warn(
      "[Kappa Button] Icon-only buttons require aria-label or aria-labelledby.",
    );
  }
});
</script>

<template>
  <button
    v-bind="$attrs"
    class="kappa-button"
    :class="{
      'kappa-button--full-width': props.fullWidth,
      'kappa-button--loading': props.loading,
    }"
    data-slot="button"
    :data-icon-position="resolvedIconPosition"
    :data-loading="props.loading ? '' : undefined"
    :data-shape="resolvedShape"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
    :aria-busy="props.loading ? 'true' : undefined"
    :disabled="props.disabled || props.loading"
    :title="resolvedTitle"
    :type="resolvedType"
  >
    <span
      v-if="props.loading"
      aria-hidden="true"
      class="kappa-button__icon kappa-button__spinner"
      data-slot="button-spinner"
      :data-position="resolvedIconPosition"
    />
    <component
      :is="props.icon"
      v-else-if="props.icon"
      v-bind="props.iconProps"
      aria-hidden="true"
      class="kappa-button__icon"
      data-icon=""
      data-slot="button-icon"
      :data-position="resolvedIconPosition"
      focusable="false"
    />
    <span v-if="$slots.default" class="kappa-button__label" data-slot="button-label">
      <slot />
    </span>
  </button>
</template>

<style src="./button.css"></style>
