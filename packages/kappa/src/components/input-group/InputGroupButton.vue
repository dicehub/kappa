<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { Button } from "../button";
import {
  BUTTON_DEFAULT_ICON_POSITION,
  BUTTON_DEFAULT_SHAPE,
  BUTTON_DEFAULT_TYPE,
  type ButtonIconPosition,
  type ButtonShape,
  type ButtonType,
  type ButtonVariant,
} from "../button/button";
import {
  INPUT_GROUP_DEFAULT_SIZE,
  resolveInputGroupSize,
  type InputGroupButtonProps,
  type InputGroupButtonSlots,
} from "./input-group";
import { useInputGroupContext } from "./context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputGroupButtonProps>(), {
  disabled: false,
  fullWidth: false,
  icon: undefined,
  iconPosition: BUTTON_DEFAULT_ICON_POSITION,
  iconProps: undefined,
  loading: false,
  shape: BUTTON_DEFAULT_SHAPE,
  size: undefined,
  title: undefined,
  type: BUTTON_DEFAULT_TYPE,
  variant: "ghost" satisfies ButtonVariant,
});

defineSlots<InputGroupButtonSlots>();

const attrs = useAttrs();
const context = useInputGroupContext();
const resolvedSize = computed(() =>
  resolveInputGroupSize(props.size ?? context?.size.value ?? INPUT_GROUP_DEFAULT_SIZE),
);
const resolvedDisabled = computed(
  () => props.disabled === true || context?.disabled.value === true,
);
const buttonAttrs = computed<Record<string, unknown>>(() => ({
  ...attrs,
  disabled: resolvedDisabled.value,
  fullWidth: props.fullWidth,
  icon: props.icon,
  iconPosition: props.iconPosition as ButtonIconPosition,
  iconProps: props.iconProps,
  loading: props.loading,
  shape: props.shape as ButtonShape,
  size: resolvedSize.value,
  title: props.title,
  type: props.type as ButtonType,
  variant: props.variant as ButtonVariant,
  "data-input-group-button": "",
}));
</script>

<template>
  <Button v-bind="buttonAttrs" class="kappa-input-group__button">
    <slot />
  </Button>
</template>
