<script setup lang="ts">
import type { ItemDescriptionSlots } from "./item";

defineOptions({ inheritAttrs: false });
defineSlots<ItemDescriptionSlots>();
</script>

<template>
  <p v-bind="$attrs" class="kappa-item__description" data-slot="item-description">
    <slot />
  </p>
</template>
