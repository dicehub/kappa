<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type { FloatingPanelTitleProps, FloatingPanelTitleSlots } from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelTitleProps>();
defineSlots<FloatingPanelTitleSlots>();
</script>

<template>
  <ArkFloatingPanel.Title
    v-bind="$attrs"
    class="kappa-floating-panel__title"
    data-slot="floating-panel-title"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFloatingPanel.Title>
</template>
