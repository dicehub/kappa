<script setup lang="ts">
import { Tabs as ArkTabs } from "@ark-ui/vue/tabs";
import type { TabsIndicatorProps, TabsIndicatorSlots } from "./tabs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabsIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<TabsIndicatorSlots>();
</script>

<template>
  <ArkTabs.Indicator
    v-bind="$attrs"
    class="kappa-tabs__indicator"
    data-slot="tabs-indicator"
    :as-child="props.asChild"
  >
    <slot />
  </ArkTabs.Indicator>
</template>
