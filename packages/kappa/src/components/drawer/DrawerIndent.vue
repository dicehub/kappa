<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import type { DrawerIndentProps, DrawerIndentSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DrawerIndentProps>(), { asChild: undefined });
defineSlots<DrawerIndentSlots>();
</script>

<template>
  <ArkDrawer.Indent
    v-bind="$attrs"
    class="kappa-drawer__indent"
    data-slot="drawer-indent"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDrawer.Indent>
</template>

<style src="./drawer.css"></style>
