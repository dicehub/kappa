<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerGrabberIndicatorProps, DrawerGrabberIndicatorSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerGrabberIndicatorProps>(), { asChild: undefined });
defineSlots<DrawerGrabberIndicatorSlots>();
</script>

<template>
  <ArkDrawer.GrabberIndicator
    v-bind="$attrs"
    class="kappa-drawer__grabber-indicator"
    data-slot="drawer-grabber-indicator"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.GrabberIndicator>
</template>

<style src="./drawer.css"></style>
