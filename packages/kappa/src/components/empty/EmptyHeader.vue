<script setup lang="ts">
import type { EmptyHeaderSlots } from "./empty";

defineOptions({ inheritAttrs: false });
defineSlots<EmptyHeaderSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-empty__header" data-slot="empty-header">
    <slot />
  </div>
</template>
