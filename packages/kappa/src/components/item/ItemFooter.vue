<script setup lang="ts">
import type { ItemFooterSlots } from "./item";

defineOptions({ inheritAttrs: false });
defineSlots<ItemFooterSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-item__footer" data-slot="item-footer">
    <slot />
  </div>
</template>
