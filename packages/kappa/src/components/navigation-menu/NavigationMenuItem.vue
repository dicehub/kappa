<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuItemProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuItemProps>(), { asChild: false, disabled: undefined });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.Item v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__item" data-slot="navigation-menu-item">
    <slot />
  </ArkNavigationMenu.Item>
</template>

<style src="./navigation-menu.css"></style>
