<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerDescriptionProps, DrawerDescriptionSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerDescriptionProps>(), { asChild: undefined });
defineSlots<DrawerDescriptionSlots>();
</script>

<template>
  <ArkDrawer.Description
    v-bind="$attrs"
    class="kappa-drawer__description"
    data-slot="drawer-description"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.Description>
</template>

<style src="./drawer.css"></style>
