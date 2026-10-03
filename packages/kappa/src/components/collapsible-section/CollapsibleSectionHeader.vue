<script setup lang="ts">
import type { CollapsibleSectionHeaderSlots } from "./collapsible-section";

defineOptions({ inheritAttrs: false });
defineSlots<CollapsibleSectionHeaderSlots>();
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-collapsible-section__header"
    data-slot="collapsible-section-header"
  >
    <slot />
  </div>
</template>
