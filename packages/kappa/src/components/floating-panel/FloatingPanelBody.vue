<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type { FloatingPanelBodyProps, FloatingPanelBodySlots } from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelBodyProps>();
defineSlots<FloatingPanelBodySlots>();
</script>

<template>
  <ArkFloatingPanel.Body
    v-bind="$attrs"
    class="kappa-floating-panel__body"
    data-slot="floating-panel-body"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFloatingPanel.Body>
</template>
