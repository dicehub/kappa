<script setup lang="ts">
import { Popover as ArkPopover } from "@ark-ui/vue/popover";
import type { PopoverContextSlots } from "./popover";

defineSlots<PopoverContextSlots>();
</script>

<template>
  <ArkPopover.Context v-slot="context">
    <slot v-bind="context" />
  </ArkPopover.Context>
</template>
