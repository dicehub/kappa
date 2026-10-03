<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import {
  FLOATING_PANEL_DEFAULT_MIN_SIZE,
  type FloatingPanelEmits,
  type FloatingPanelProps,
  type FloatingPanelRootSlots,
} from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FloatingPanelProps>(), {
  allowOverflow: false,
  closeOnEscape: true,
  defaultOpen: undefined,
  disabled: false,
  draggable: true,
  lazyMount: true,
  lockAspectRatio: false,
  minSize: () => ({ ...FLOATING_PANEL_DEFAULT_MIN_SIZE }),
  open: undefined,
  persistRect: false,
  resizable: true,
  restoreFocus: true,
  unmountOnExit: false,
});

const emit = defineEmits<FloatingPanelEmits>();
defineSlots<FloatingPanelRootSlots>();
</script>

<template>
  <ArkFloatingPanel.Root
    v-bind="{ ...props, ...$attrs }"
    @exit-complete="emit('exitComplete')"
    @open-change="emit('openChange', $event)"
    @position-change="emit('positionChange', $event)"
    @position-change-end="emit('positionChangeEnd', $event)"
    @size-change="emit('sizeChange', $event)"
    @size-change-end="emit('sizeChangeEnd', $event)"
    @stage-change="emit('stageChange', $event)"
    @update:open="emit('update:open', $event)"
    @update:position="emit('update:position', $event)"
    @update:size="emit('update:size', $event)"
  >
    <slot />
  </ArkFloatingPanel.Root>
</template>
