<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type {
  DrawerRootProviderEmits,
  DrawerRootProviderProps,
  DrawerRootProviderSlots,
} from "./drawer";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerRootProviderProps>(), {
  lazyMount: true,
  unmountOnExit: true,
});
const emit = defineEmits<DrawerRootProviderEmits>();
defineSlots<DrawerRootProviderSlots>();
</script>

<template>
  <ArkDrawer.RootProvider
    v-bind="$attrs"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    :value="props.value"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkDrawer.RootProvider>
</template>
