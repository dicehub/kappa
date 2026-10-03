<script setup lang="ts">
import type { EmptyContentSlots } from "./empty";

defineOptions({ inheritAttrs: false });
defineSlots<EmptyContentSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-empty__content" data-slot="empty-content">
    <slot />
  </div>
</template>
