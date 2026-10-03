<script setup lang="ts">
import { HoverCard as ArkHoverCard } from "@ark-ui/vue/hover-card";
import type {
  HoverCardRootProviderEmits,
  HoverCardRootProviderProps,
  HoverCardRootProviderSlots,
} from "./hover-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HoverCardRootProviderProps>(), {
  lazyMount: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<HoverCardRootProviderEmits>();
defineSlots<HoverCardRootProviderSlots>();
</script>

<template>
  <ArkHoverCard.RootProvider
    v-bind="$attrs"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    :value="props.value"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkHoverCard.RootProvider>
</template>
