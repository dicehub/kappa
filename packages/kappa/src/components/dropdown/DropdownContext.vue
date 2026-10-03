<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownContextSlots } from "./dropdown";

defineSlots<DropdownContextSlots>();
</script>

<template>
  <ArkMenu.Context v-slot="context">
    <slot v-bind="context" />
  </ArkMenu.Context>
</template>
