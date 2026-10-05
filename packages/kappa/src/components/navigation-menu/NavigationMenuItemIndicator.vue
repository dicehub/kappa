<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuItemIndicatorProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuItemIndicatorProps>(), { asChild: false });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.ItemIndicator v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__item-indicator" data-slot="navigation-menu-item-indicator">
    <slot />
  </ArkNavigationMenu.ItemIndicator>
</template>

<style src="./navigation-menu.css"></style>
