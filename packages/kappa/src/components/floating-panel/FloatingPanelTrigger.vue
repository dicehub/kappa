<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type { FloatingPanelTriggerProps, FloatingPanelTriggerSlots } from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelTriggerProps>();
defineSlots<FloatingPanelTriggerSlots>();
</script>

<template>
  <ArkFloatingPanel.Trigger
    v-bind="$attrs"
    class="kappa-floating-panel__trigger"
    data-slot="floating-panel-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFloatingPanel.Trigger>
</template>
