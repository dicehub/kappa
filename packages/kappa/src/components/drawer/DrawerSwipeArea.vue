<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerSwipeAreaProps, DrawerSwipeAreaSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerSwipeAreaProps>(), { asChild: undefined });
defineSlots<DrawerSwipeAreaSlots>();
</script>

<template>
  <ArkDrawer.SwipeArea
    v-bind="$attrs"
    class="kappa-drawer__swipe-area"
    data-slot="drawer-swipe-area"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.SwipeArea>
</template>

<style src="./drawer.css"></style>
