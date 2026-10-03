<script setup lang="ts">
import { ScrollArea as ArkScrollArea } from "@ark-ui/vue/scroll-area";
import type { ScrollAreaContextSlots } from "./scroll-area";

defineSlots<ScrollAreaContextSlots>();
</script>

<template>
  <ArkScrollArea.Context v-slot="context">
    <slot v-bind="context" />
  </ArkScrollArea.Context>
</template>
