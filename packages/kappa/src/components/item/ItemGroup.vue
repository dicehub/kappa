<script setup lang="ts">
import type { ItemGroupSlots } from "./item";

defineOptions({ inheritAttrs: false });
defineSlots<ItemGroupSlots>();
</script>

<template>
  <div
    class="kappa-item-group"
    data-slot="item-group"
    role="list"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
