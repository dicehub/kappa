<script setup lang="ts">
import { FloatingPanel as ArkFloatingPanel } from "@ark-ui/vue/floating-panel";
import type {
  FloatingPanelRootProviderEmits,
  FloatingPanelRootProviderProps,
  FloatingPanelRootProviderSlots,
} from "./floating-panel";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FloatingPanelRootProviderProps>(), {
  lazyMount: true,
  unmountOnExit: false,
});
const emit = defineEmits<FloatingPanelRootProviderEmits>();
defineSlots<FloatingPanelRootProviderSlots>();
</script>

<template>
  <ArkFloatingPanel.RootProvider
    v-bind="$attrs"
    :value="props.value"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    @enter-complete="emit('enterComplete')"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkFloatingPanel.RootProvider>
</template>
