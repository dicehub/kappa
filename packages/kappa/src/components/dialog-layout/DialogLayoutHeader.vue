<script setup lang="ts">
import type { DialogLayoutHeaderSlots } from "./dialog-layout";

defineOptions({ inheritAttrs: false });
defineSlots<DialogLayoutHeaderSlots>();
</script>

<template>
  <header
    v-bind="$attrs"
    class="kappa-dialog-layout__header"
    data-slot="dialog-layout-header"
  >
    <slot />
  </header>
</template>

<style src="./dialog-layout.css"></style>
