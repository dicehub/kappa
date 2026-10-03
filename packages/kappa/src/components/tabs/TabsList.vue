<script setup lang="ts">
import { Tabs as ArkTabs } from "@ark-ui/vue/tabs";
import { computed } from "vue";
import {
  TABS_DEFAULT_SIZE,
  TABS_DEFAULT_VARIANT,
  resolveTabsSize,
  resolveTabsVariant,
  type TabsListProps,
  type TabsListSlots,
} from "./tabs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabsListProps>(), {
  asChild: undefined,
  size: TABS_DEFAULT_SIZE,
  variant: TABS_DEFAULT_VARIANT,
});

defineSlots<TabsListSlots>();

const resolvedSize = computed(() => resolveTabsSize(props.size));
const resolvedVariant = computed(() => resolveTabsVariant(props.variant));
</script>

<template>
  <ArkTabs.List
    v-bind="$attrs"
    class="kappa-tabs__list"
    data-slot="tabs-list"
    :as-child="props.asChild"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
  >
    <slot />
  </ArkTabs.List>
</template>
