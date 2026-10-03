<script setup lang="ts">
import DialogRoot from "../dialog/Dialog.vue";
import type {
  DialogLayoutAlertProps,
  DialogLayoutAlertSlots,
} from "./dialog-layout";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogLayoutAlertProps>(), {
  ariaLabel: undefined,
  closeOnEscape: true,
  closeOnInteractOutside: undefined,
  defaultOpen: undefined,
  defaultTriggerValue: undefined,
  disablePointerDismissal: false,
  finalFocusEl: undefined,
  id: undefined,
  ids: undefined,
  initialFocusEl: undefined,
  lazyMount: true,
  modal: true,
  open: undefined,
  persistentElements: undefined,
  preventScroll: true,
  restoreFocus: true,
  trapFocus: true,
  triggerValue: undefined,
  unmountOnExit: true,
});
defineSlots<DialogLayoutAlertSlots>();
</script>

<template>
  <DialogRoot v-bind="{ ...props, ...$attrs }" role="alertdialog">
    <slot />
  </DialogRoot>
</template>
