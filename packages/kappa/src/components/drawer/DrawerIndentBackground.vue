<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerIndentBackgroundProps, DrawerIndentBackgroundSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerIndentBackgroundProps>(), { asChild: undefined });
defineSlots<DrawerIndentBackgroundSlots>();
</script>

<template>
  <ArkDrawer.IndentBackground
    v-bind="$attrs"
    class="kappa-drawer__indent-background"
    data-slot="drawer-indent-background"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.IndentBackground>
</template>

<style src="./drawer.css"></style>
