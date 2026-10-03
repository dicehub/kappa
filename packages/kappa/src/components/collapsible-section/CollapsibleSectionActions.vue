<script setup lang="ts">
import type { CollapsibleSectionActionsSlots } from "./collapsible-section";

defineOptions({ inheritAttrs: false });
defineSlots<CollapsibleSectionActionsSlots>();
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-collapsible-section__actions"
    data-slot="collapsible-section-actions"
  >
    <slot />
  </div>
</template>
