<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerTitleProps, DrawerTitleSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerTitleProps>(), { asChild: undefined });
defineSlots<DrawerTitleSlots>();
</script>

<template>
  <ArkDrawer.Title
    v-bind="$attrs"
    class="kappa-drawer__title"
    data-slot="drawer-title"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.Title>
</template>

<style src="./drawer.css"></style>
