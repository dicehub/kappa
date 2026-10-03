<script setup lang="ts">
import { HoverCard as ArkHoverCard } from "@ark-ui/vue/hover-card";
import type { HoverCardContextSlots } from "./hover-card";

defineSlots<HoverCardContextSlots>();
</script>

<template>
  <ArkHoverCard.Context v-slot="context">
    <slot v-bind="context" />
  </ArkHoverCard.Context>
</template>
