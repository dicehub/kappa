<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuTriggerProps, NavigationMenuSlots } from "./navigation-menu";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuTriggerProps>(), {
  asChild: false, disabled: undefined, showIndicator: true,
});
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.Trigger v-bind="$attrs" :as-child="props.asChild" :disabled="props.disabled"
    class="kappa-navigation-menu__trigger" data-slot="navigation-menu-trigger">
    <slot />
    <svg v-if="props.showIndicator && !props.asChild" class="kappa-navigation-menu__chevron"
      viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="m4.5 6.25 3.5 3.5 3.5-3.5" />
    </svg>
  </ArkNavigationMenu.Trigger>
</template>

<style src="./navigation-menu.css"></style>
