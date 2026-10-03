<script setup lang="ts">
import type { DialogLayoutBodySlots } from "./dialog-layout";

defineOptions({ inheritAttrs: false });
defineSlots<DialogLayoutBodySlots>();
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-dialog-layout__body"
    data-slot="dialog-layout-body"
  >
    <slot />
  </div>
</template>

<style src="./dialog-layout.css"></style>
