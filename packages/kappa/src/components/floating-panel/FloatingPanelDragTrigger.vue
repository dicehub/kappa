<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type {
  FloatingPanelDragTriggerProps,
  FloatingPanelDragTriggerSlots,
} from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelDragTriggerProps>();
defineSlots<FloatingPanelDragTriggerSlots>();
</script>

<template>
  <ArkFloatingPanel.DragTrigger
    v-bind="$attrs"
    class="kappa-floating-panel__drag-trigger"
    data-slot="floating-panel-drag-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFloatingPanel.DragTrigger>
</template>
