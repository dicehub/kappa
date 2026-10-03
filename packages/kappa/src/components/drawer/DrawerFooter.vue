<script setup lang="ts">
import type { DrawerFooterSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
defineSlots<DrawerFooterSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-drawer__footer" data-slot="drawer-footer"><slot /></div>
</template>

<style src="./drawer.css"></style>
