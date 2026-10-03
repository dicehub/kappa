<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type {
  FloatingPanelResizeTriggerProps,
  FloatingPanelResizeTriggerSlots,
} from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelResizeTriggerProps>();
defineSlots<FloatingPanelResizeTriggerSlots>();
</script>

<template>
  <ArkFloatingPanel.ResizeTrigger
    v-bind="$attrs"
    class="kappa-floating-panel__resize-trigger"
    data-slot="floating-panel-resize-trigger"
    :as-child="props.asChild"
    :axis="props.axis"
  >
    <slot />
  </ArkFloatingPanel.ResizeTrigger>
</template>
