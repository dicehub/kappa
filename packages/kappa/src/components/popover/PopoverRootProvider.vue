<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type {
  PopoverRootProviderEmits,
  PopoverRootProviderProps,
  PopoverRootProviderSlots,
} from "./popover";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverRootProviderProps>(), {
  lazyMount: true,
  unmountOnExit: true,
});

const emit = defineEmits<PopoverRootProviderEmits>();
defineSlots<PopoverRootProviderSlots>();
</script>

<template>
  <ArkPopover.RootProvider
    v-bind="$attrs"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    :value="props.value"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkPopover.RootProvider>
</template>
