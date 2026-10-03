<script setup lang="ts">
import type { ItemContentSlots } from "./item";

defineOptions({ inheritAttrs: false });
defineSlots<ItemContentSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-item__content" data-slot="item-content">
    <slot />
  </div>
</template>
