<script setup lang="ts">
import Button from "../button/Button.vue";
import {
  DIALOG_LAYOUT_DEFAULT_PRIMARY_VARIANT,
  type DialogLayoutPrimaryActionProps,
  type DialogLayoutPrimaryActionSlots,
} from "./dialog-layout";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogLayoutPrimaryActionProps>(), {
  disabled: false,
  loading: false,
  size: "sm",
  type: "button",
  variant: DIALOG_LAYOUT_DEFAULT_PRIMARY_VARIANT,
});

defineSlots<DialogLayoutPrimaryActionSlots>();
</script>

<template>
  <Button
    v-bind="$attrs"
    data-slot="dialog-layout-primary-action"
    :disabled="props.disabled"
    :loading="props.loading"
    :size="props.size"
    :type="props.type"
    :variant="props.variant"
  >
    <slot />
  </Button>
</template>
