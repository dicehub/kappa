<script setup lang="ts">
import type { ItemActionsSlots } from "./item";

defineOptions({ inheritAttrs: false });
defineSlots<ItemActionsSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-item__actions" data-slot="item-actions">
    <slot />
  </div>
</template>
