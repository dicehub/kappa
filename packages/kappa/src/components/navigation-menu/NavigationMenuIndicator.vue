<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuIndicatorProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuIndicatorProps>(), { asChild: false });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.Indicator v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__indicator" data-slot="navigation-menu-indicator">
    <slot />
  </ArkNavigationMenu.Indicator>
</template>

<style src="./navigation-menu.css"></style>
