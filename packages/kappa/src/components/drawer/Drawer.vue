<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import { LocaleProvider } from "@ark-ui/vue/locale";
import { computed } from "vue";
import {
  DRAWER_DEFAULT_ROLE,
  DRAWER_DEFAULT_SWIPE_DIRECTION,
  type DrawerEmits,
  type DrawerProps,
  type DrawerSlots,
} from "./drawer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DrawerProps>(), {
  closeOnEscape: true,
  closeOnInteractOutside: true,
  closeThreshold: undefined,
  defaultOpen: undefined,
  defaultSnapPoint: undefined,
  defaultTriggerValue: undefined,
  finalFocusEl: undefined,
  id: undefined,
  ids: undefined,
  initialFocusEl: undefined,
  lazyMount: true,
  locale: "en-US",
  modal: true,
  open: undefined,
  preventDragOnScroll: true,
  preventScroll: true,
  restoreFocus: true,
  role: DRAWER_DEFAULT_ROLE,
  snapPoint: undefined,
  snapPoints: undefined,
  snapToSequentialPoints: false,
  swipeDirection: DRAWER_DEFAULT_SWIPE_DIRECTION,
  swipeVelocityThreshold: undefined,
  trapFocus: true,
  triggerValue: undefined,
  unmountOnExit: true,
});

const emit = defineEmits<DrawerEmits>();
defineSlots<DrawerSlots>();

const rootProps = computed(() => ({
  closeOnEscape: props.closeOnEscape,
  closeOnInteractOutside: props.closeOnInteractOutside,
  ...(props.closeThreshold !== undefined ? { closeThreshold: props.closeThreshold } : {}),
  ...(props.defaultOpen !== undefined ? { defaultOpen: props.defaultOpen } : {}),
  ...(props.defaultSnapPoint !== undefined
    ? { defaultSnapPoint: props.defaultSnapPoint }
    : {}),
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
  preventDragOnScroll: props.preventDragOnScroll,
  preventScroll: props.preventScroll,
  restoreFocus: props.restoreFocus,
  role: props.role,
  ...(props.snapPoint !== undefined ? { snapPoint: props.snapPoint } : {}),
  ...(props.snapPoints !== undefined ? { snapPoints: props.snapPoints } : {}),
  snapToSequentialPoints: props.snapToSequentialPoints,
  swipeDirection: props.swipeDirection,
  ...(props.swipeVelocityThreshold !== undefined
    ? { swipeVelocityThreshold: props.swipeVelocityThreshold }
    : {}),
  trapFocus: props.trapFocus,
  ...(props.triggerValue !== undefined ? { triggerValue: props.triggerValue } : {}),
  unmountOnExit: props.unmountOnExit,
}));
</script>

<template>
  <LocaleProvider :locale="props.locale">
    <ArkDrawer.Root
      v-bind="{ ...rootProps, ...$attrs }"
      @exit-complete="emit('exitComplete')"
      @open-change="emit('openChange', $event)"
      @snap-point-change="emit('snapPointChange', $event)"
      @trigger-value-change="emit('triggerValueChange', $event)"
      @update:open="emit('update:open', $event)"
      @update:snap-point="emit('update:snapPoint', $event)"
      @update:trigger-value="emit('update:triggerValue', $event)"
    >
      <slot />
    </ArkDrawer.Root>
  </LocaleProvider>
</template>
