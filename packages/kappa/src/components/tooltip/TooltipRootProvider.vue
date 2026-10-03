<script setup lang="ts">
import { Tooltip as ArkTooltip } from "@ark-ui/vue/tooltip";
import type {
  TooltipRootProviderEmits,
  TooltipRootProviderProps,
  TooltipRootProviderSlots,
} from "./tooltip";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TooltipRootProviderProps>(), {
  lazyMount: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<TooltipRootProviderEmits>();
defineSlots<TooltipRootProviderSlots>();
</script>

<template>
  <ArkTooltip.RootProvider
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    :value="props.value"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkTooltip.RootProvider>
</template>
