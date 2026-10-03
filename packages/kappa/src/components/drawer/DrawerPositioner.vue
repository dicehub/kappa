<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerPositionerProps, DrawerPositionerSlots } from "./drawer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DrawerPositionerProps>(), { asChild: undefined });
defineSlots<DrawerPositionerSlots>();
</script>

<template>
  <ArkDrawer.Positioner
    v-bind="$attrs"
    class="kappa-drawer__positioner"
    data-slot="drawer-positioner"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.Positioner>
</template>

<style src="./drawer.css"></style>
