<script setup lang="ts">
import { Tabs as ArkTabs } from "@ark-ui/vue/tabs";
import type { TabsContentProps, TabsContentSlots } from "./tabs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabsContentProps>(), {
  asChild: undefined,
});

defineSlots<TabsContentSlots>();
</script>

<template>
  <ArkTabs.Content
    v-bind="$attrs"
    class="kappa-tabs__content"
    data-slot="tabs-content"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkTabs.Content>
</template>
