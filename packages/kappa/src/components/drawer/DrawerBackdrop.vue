<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerBackdropProps, DrawerBackdropSlots } from "./drawer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DrawerBackdropProps>(), { asChild: undefined });
defineSlots<DrawerBackdropSlots>();
</script>

<template>
  <ArkDrawer.Backdrop
    v-bind="$attrs"
    class="kappa-drawer__backdrop"
    data-slot="drawer-backdrop"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.Backdrop>
</template>

<style src="./drawer.css"></style>
