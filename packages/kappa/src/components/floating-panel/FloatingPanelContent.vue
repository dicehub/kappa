<script setup lang="ts">
import {
  FloatingPanel as ArkFloatingPanel,
  useFloatingPanelContext,
} from "@ark-ui/vue/floating-panel";
import { computed } from "vue";
import type { FloatingPanelContentProps, FloatingPanelContentSlots } from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelContentProps>();
defineSlots<FloatingPanelContentSlots>();

const panel = useFloatingPanelContext();
const disabled = computed(
  () => (panel.value.getControlProps() as Record<string, unknown>)["data-disabled"] !== undefined,
);
</script>

<template>
  <ArkFloatingPanel.Content
    v-bind="$attrs"
    class="kappa-floating-panel__content"
    :data-disabled="disabled || undefined"
    data-slot="floating-panel-content"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFloatingPanel.Content>
</template>

<style src="./floating-panel.css"></style>
