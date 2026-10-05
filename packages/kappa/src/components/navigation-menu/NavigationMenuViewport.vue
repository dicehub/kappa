<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuViewportProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuViewportProps>(), { asChild: false });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.Viewport v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__viewport" data-slot="navigation-menu-viewport">
    <slot />
  </ArkNavigationMenu.Viewport>
</template>

<style src="./navigation-menu.css"></style>
