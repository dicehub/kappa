<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import { computed, onMounted, ref, Teleport } from "vue";
import type { FloatingPanelPositionerProps, FloatingPanelPositionerSlots } from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FloatingPanelPositionerProps>(), {
  teleport: true,
  teleportTo: "body",
});
defineSlots<FloatingPanelPositionerSlots>();

const isMounted = ref(false);
const positionerStyle = computed(() => ({
  zIndex: "calc(var(--kappa-floating-panel-z-index, 800) + var(--z-index, 0))",
}));

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <ArkFloatingPanel.Positioner
      v-bind="$attrs"
      class="kappa-floating-panel__positioner"
      data-slot="floating-panel-positioner"
      :as-child="props.asChild"
      :style="positionerStyle"
    >
      <slot />
    </ArkFloatingPanel.Positioner>
  </Teleport>
</template>
