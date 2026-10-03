<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownItemContextSlots } from "./dropdown";

defineSlots<DropdownItemContextSlots>();
</script>

<template>
  <ArkMenu.ItemContext v-slot="context">
    <slot v-bind="context" />
  </ArkMenu.ItemContext>
</template>
