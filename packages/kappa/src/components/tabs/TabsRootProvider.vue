<script setup lang="ts">
import { Tabs as ArkTabs } from "@ark-ui/vue/tabs";
import type { TabsRootProviderProps, TabsRootProviderSlots } from "./tabs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabsRootProviderProps>(), {
  asChild: undefined,
  lazyMount: undefined,
  unmountOnExit: undefined,
});

defineSlots<TabsRootProviderSlots>();
</script>

<template>
  <ArkTabs.RootProvider
    v-bind="$attrs"
    class="kappa-tabs"
    data-slot="tabs"
    :as-child="props.asChild"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    :value="props.value"
  >
    <slot />
  </ArkTabs.RootProvider>
</template>

<style src="./tabs.css"></style>
