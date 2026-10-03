<script setup lang="ts">
import { Tabs as ArkTabs } from "@ark-ui/vue/tabs";
import type { TabsTriggerProps, TabsTriggerSlots } from "./tabs";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TabsTriggerProps>(), {
  asChild: undefined,
  disabled: undefined,
});

defineSlots<TabsTriggerSlots>();
</script>

<template>
  <ArkTabs.Trigger
    v-bind="$attrs"
    class="kappa-tabs__trigger"
    data-slot="tabs-trigger"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :value="props.value"
  >
    <slot />
  </ArkTabs.Trigger>
</template>
