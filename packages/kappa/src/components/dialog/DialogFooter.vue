<script setup lang="ts">
import type { DialogFooterSlots } from "./dialog";

defineOptions({ inheritAttrs: false });
defineSlots<DialogFooterSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-dialog__footer" data-slot="dialog-footer">
    <slot />
  </div>
</template>

<style src="./dialog.css"></style>
