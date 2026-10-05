<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuLinkProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuLinkProps>(), { asChild: false, current: undefined, closeOnClick: true });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.Link v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__link" data-slot="navigation-menu-link">
    <slot />
  </ArkNavigationMenu.Link>
</template>

<style src="./navigation-menu.css"></style>
