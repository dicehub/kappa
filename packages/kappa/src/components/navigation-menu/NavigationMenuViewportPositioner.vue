<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuViewportPositionerProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuViewportPositionerProps>(), { asChild: false, align: "center" });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.ViewportPositioner v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__viewport-positioner" data-slot="navigation-menu-viewport-positioner">
    <slot />
  </ArkNavigationMenu.ViewportPositioner>
</template>

<style src="./navigation-menu.css"></style>
