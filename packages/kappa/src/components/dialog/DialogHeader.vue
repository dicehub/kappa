<script setup lang="ts">
import type { DialogHeaderSlots } from "./dialog";

defineOptions({ inheritAttrs: false });
defineSlots<DialogHeaderSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-dialog__header" data-slot="dialog-header">
    <slot />
  </div>
</template>

<style src="./dialog.css"></style>
