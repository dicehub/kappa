<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import { computed, useAttrs } from "vue";
import {
  type FloatingPanelStageTriggerProps,
  type FloatingPanelStageTriggerSlots,
} from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = defineProps<FloatingPanelStageTriggerProps>();
defineSlots<FloatingPanelStageTriggerSlots>();

const attrs = useAttrs();
const forwardedAttrs = computed(() => ({
  ...attrs,
  ...(typeof attrs["aria-label"] !== "string" && props.label
    ? { "aria-label": props.label }
    : {}),
}));
</script>

<template>
  <ArkFloatingPanel.StageTrigger
    v-bind="forwardedAttrs"
    class="kappa-floating-panel__control-button"
    data-slot="floating-panel-stage-trigger"
    :as-child="props.asChild"
    :stage="props.stage"
  >
    <slot>
      <svg v-if="props.stage === 'minimized'" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 12.5h10" />
      </svg>
      <svg v-else-if="props.stage === 'maximized'" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2.75" y="2.75" width="10.5" height="10.5" rx="1.25" />
      </svg>
      <svg v-else viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2.75" y="5" width="8.25" height="8.25" rx="1.1" />
        <path d="M5 5V3.85c0-.6.49-1.1 1.1-1.1h6.05c.6 0 1.1.49 1.1 1.1V9.9c0 .6-.49 1.1-1.1 1.1H11" />
      </svg>
    </slot>
  </ArkFloatingPanel.StageTrigger>
</template>
