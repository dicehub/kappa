<script setup lang="ts">
import type { ItemHeaderSlots } from "./item";

defineOptions({ inheritAttrs: false });
defineSlots<ItemHeaderSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-item__header" data-slot="item-header">
    <slot />
  </div>
</template>
