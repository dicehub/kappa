<script setup lang="ts">
import { NavigationMenu as ArkNavigationMenu } from "@ark-ui/vue/navigation-menu";
import { computed } from "vue";
import type { NavigationMenuProps, NavigationMenuEmits, NavigationMenuSlots } from "./navigation-menu";
import { useNavigationMenu } from "./use-navigation-menu";
import { getNavigationMenuAttrs } from "./navigation-menu-attrs";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<NavigationMenuProps>(), {
  size: "md",
  disableClickTrigger: undefined,
  disableHoverTrigger: undefined,
  disablePointerLeaveClose: undefined,
});
const emit = defineEmits<NavigationMenuEmits>();
defineSlots<NavigationMenuSlots>();
const rootProps = computed(() => {
  const { size, ...rest } = props;
  return rest;
});
const api = useNavigationMenu(rootProps, emit);
</script>

<template>
  <ArkNavigationMenu.RootProvider
    v-bind="getNavigationMenuAttrs($attrs)"
    :value="api"
    :lazy-mount="false"
    :unmount-on-exit="false"
    class="kappa-navigation-menu"
    data-slot="navigation-menu"
    :data-size="props.size"
  ><slot /></ArkNavigationMenu.RootProvider>
</template>

<style src="./navigation-menu.css"></style>
