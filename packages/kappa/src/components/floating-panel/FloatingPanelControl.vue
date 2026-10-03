<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type { FloatingPanelControlProps, FloatingPanelControlSlots } from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelControlProps>();
defineSlots<FloatingPanelControlSlots>();
</script>

<template>
  <ArkFloatingPanel.Control
    v-bind="$attrs"
    class="kappa-floating-panel__control"
    data-no-drag
    data-slot="floating-panel-control"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFloatingPanel.Control>
</template>
