<script setup lang="ts">
import { Tabs as ArkTabs } from "@ark-ui/vue/tabs";
import type { TabsContextSlots } from "./tabs";

defineSlots<TabsContextSlots>();
</script>

<template>
  <ArkTabs.Context v-slot="context">
    <slot v-bind="context" />
  </ArkTabs.Context>
</template>
