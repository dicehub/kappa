<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import { useSlots } from "vue";
import DrawerGrabberIndicator from "./DrawerGrabberIndicator.vue";
import type { DrawerGrabberProps, DrawerGrabberSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerGrabberProps>(), { asChild: undefined });
defineSlots<DrawerGrabberSlots>();
const slots = useSlots();
</script>

<template>
  <ArkDrawer.Grabber
    v-bind="$attrs"
    class="kappa-drawer__grabber"
    data-slot="drawer-grabber"
    :as-child="props.asChild"
  >
    <slot v-if="slots.default" />
    <DrawerGrabberIndicator v-else />
  </ArkDrawer.Grabber>
</template>

<style src="./drawer.css"></style>
