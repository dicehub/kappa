<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type { FloatingPanelHeaderProps, FloatingPanelHeaderSlots } from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelHeaderProps>();
defineSlots<FloatingPanelHeaderSlots>();
</script>

<template>
  <ArkFloatingPanel.Header
    v-bind="$attrs"
    class="kappa-floating-panel__header"
    data-slot="floating-panel-header"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFloatingPanel.Header>
</template>
