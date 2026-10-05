<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import type { NavigationMenuRootProviderProps, NavigationMenuSlots } from "./navigation-menu";
import { getNavigationMenuAttrs } from "./navigation-menu-attrs";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuRootProviderProps>(), {
  size: "md",
});
defineSlots<NavigationMenuSlots>();
</script>

<template>
  <ArkNavigationMenu.RootProvider v-bind="getNavigationMenuAttrs($attrs)" :value="props.value"
    :lazy-mount="false" :unmount-on-exit="false"
    class="kappa-navigation-menu" data-slot="navigation-menu" :data-size="props.size">
    <slot />
  </ArkNavigationMenu.RootProvider>
</template>

<style src="./navigation-menu.css"></style>
