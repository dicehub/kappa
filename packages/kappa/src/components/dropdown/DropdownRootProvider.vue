<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type {
  DropdownRootProviderEmits,
  DropdownRootProviderProps,
  DropdownRootProviderSlots,
} from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownRootProviderProps>(), {
  lazyMount: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<DropdownRootProviderEmits>();
defineSlots<DropdownRootProviderSlots>();
</script>

<template>
  <ArkMenu.RootProvider
    v-bind="$attrs"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    :value="props.value"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkMenu.RootProvider>
</template>
