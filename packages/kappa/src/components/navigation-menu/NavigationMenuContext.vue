<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuContextSlots } from "./navigation-menu";
defineSlots<NavigationMenuContextSlots>();
</script>
<template>
  <ArkNavigationMenu.Context v-slot="context"><slot v-bind="context" /></ArkNavigationMenu.Context>
</template>
