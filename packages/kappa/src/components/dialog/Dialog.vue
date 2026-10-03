<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import { computed } from "vue";
import {
  DIALOG_DEFAULT_ROLE,
  type DialogEmits,
  type DialogProps,
  type DialogSlots,
} from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogProps>(), {
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
  role: DIALOG_DEFAULT_ROLE,
  trapFocus: true,
  triggerValue: undefined,
  unmountOnExit: true,
});

const emit = defineEmits<DialogEmits>();
defineSlots<DialogSlots>();

const resolvedCloseOnInteractOutside = computed(() => {
  if (props.disablePointerDismissal) return false;
  if (props.closeOnInteractOutside !== undefined) return props.closeOnInteractOutside;
  return props.role === "alertdialog" ? false : undefined;
});

const rootProps = computed(() => ({
  ...(props.ariaLabel !== undefined ? { "aria-label": props.ariaLabel } : {}),
  closeOnEscape: props.closeOnEscape,
  ...(resolvedCloseOnInteractOutside.value !== undefined
    ? { closeOnInteractOutside: resolvedCloseOnInteractOutside.value }
    : {}),
  ...(props.defaultOpen !== undefined ? { defaultOpen: props.defaultOpen } : {}),
  ...(props.defaultTriggerValue !== undefined
    ? { defaultTriggerValue: props.defaultTriggerValue }
    : {}),
  ...(props.finalFocusEl !== undefined ? { finalFocusEl: props.finalFocusEl } : {}),
  ...(props.id !== undefined ? { id: props.id } : {}),
  ...(props.ids !== undefined ? { ids: props.ids } : {}),
  ...(props.initialFocusEl !== undefined ? { initialFocusEl: props.initialFocusEl } : {}),
  lazyMount: props.lazyMount,
  modal: props.modal,
  ...(props.open !== undefined ? { open: props.open } : {}),
  ...(props.persistentElements !== undefined
    ? { persistentElements: props.persistentElements }
    : {}),
  preventScroll: props.preventScroll,
  restoreFocus: props.restoreFocus,
  role: props.role,
  trapFocus: props.trapFocus,
  ...(props.triggerValue !== undefined ? { triggerValue: props.triggerValue } : {}),
  unmountOnExit: props.unmountOnExit,
}));
</script>

<template>
  <ArkDialog.Root
    v-bind="{ ...rootProps, ...$attrs }"
    @escape-key-down="emit('escapeKeyDown', $event)"
    @exit-complete="emit('exitComplete')"
    @focus-outside="emit('focusOutside', $event)"
    @interact-outside="emit('interactOutside', $event)"
    @open-change="emit('openChange', $event)"
    @pointer-down-outside="emit('pointerDownOutside', $event)"
    @request-dismiss="emit('requestDismiss', $event)"
    @trigger-value-change="emit('triggerValueChange', $event)"
    @update:open="emit('update:open', $event)"
    @update:trigger-value="emit('update:triggerValue', $event)"
  >
    <slot />
  </ArkDialog.Root>
</template>
