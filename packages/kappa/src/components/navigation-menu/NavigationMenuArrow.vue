<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuArrowProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuArrowProps>(), { asChild: false });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.Arrow v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__arrow" data-slot="navigation-menu-arrow">
    <slot />
  </ArkNavigationMenu.Arrow>
</template>

<style src="./navigation-menu.css"></style>
