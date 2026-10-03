<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type { FloatingPanelContextSlots } from "./floating-panel";

defineSlots<FloatingPanelContextSlots>();
</script>

<template>
  <ArkFloatingPanel.Context v-slot="context">
    <slot v-bind="context" />
  </ArkFloatingPanel.Context>
</template>
