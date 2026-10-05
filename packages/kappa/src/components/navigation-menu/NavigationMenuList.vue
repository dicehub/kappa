<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuListProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuListProps>(), { asChild: false });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.List v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__list" data-slot="navigation-menu-list">
    <slot />
  </ArkNavigationMenu.List>
</template>

<style src="./navigation-menu.css"></style>
