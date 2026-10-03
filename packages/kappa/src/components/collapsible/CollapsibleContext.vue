<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type { CollapsibleContextSlots } from "./collapsible";

defineSlots<CollapsibleContextSlots>();
</script>

<template>
  <ArkCollapsible.Context v-slot="context">
    <slot v-bind="context" />
  </ArkCollapsible.Context>
</template>
