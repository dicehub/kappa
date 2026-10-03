<script setup lang="ts">
import type { EmptyDescriptionSlots } from "./empty";

defineOptions({ inheritAttrs: false });
defineSlots<EmptyDescriptionSlots>();
</script>

<template>
  <p v-bind="$attrs" class="kappa-empty__description" data-slot="empty-description">
    <slot />
  </p>
</template>
