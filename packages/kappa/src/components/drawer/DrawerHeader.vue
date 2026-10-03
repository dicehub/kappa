<script setup lang="ts">
import type { DrawerHeaderSlots } from "./drawer";

defineOptions({ inheritAttrs: false });
defineSlots<DrawerHeaderSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-drawer__header" data-slot="drawer-header"><slot /></div>
</template>

<style src="./drawer.css"></style>
