<script setup lang="ts">
import { Tooltip as ArkTooltip } from "@ark-ui/vue/tooltip";
import type { TooltipContextSlots } from "./tooltip";

defineSlots<TooltipContextSlots>();
</script>

<template>
  <ArkTooltip.Context v-slot="context">
    <slot v-bind="context" />
  </ArkTooltip.Context>
</template>
