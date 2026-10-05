<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuContentProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuContentProps>(), { asChild: false });
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.Content v-bind="{ ...$attrs, ...props }"
    class="kappa-navigation-menu__content" data-slot="navigation-menu-content">
    <slot />
  </ArkNavigationMenu.Content>
</template>

<style src="./navigation-menu.css"></style>
