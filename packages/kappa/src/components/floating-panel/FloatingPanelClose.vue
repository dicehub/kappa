<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import { computed, useAttrs } from "vue";
import type { FloatingPanelCloseProps, FloatingPanelCloseSlots } from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FloatingPanelCloseProps>(), {
  label: "Close panel",
});
defineSlots<FloatingPanelCloseSlots>();

const attrs = useAttrs();
const resolvedLabel = computed(() =>
  typeof attrs["aria-label"] === "string" ? attrs["aria-label"] : props.label,
);
</script>

<template>
  <ArkFloatingPanel.CloseTrigger
    v-bind="$attrs"
    class="kappa-floating-panel__control-button"
    data-slot="floating-panel-close-trigger"
    :aria-label="resolvedLabel"
    :as-child="props.asChild"
  >
    <slot>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="m4 4 8 8M12 4l-8 8" />
      </svg>
    </slot>
  </ArkFloatingPanel.CloseTrigger>
</template>
