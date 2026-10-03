<script setup lang="ts">
import type { PropertyListSlots } from "./property-list";
defineOptions({ inheritAttrs: false });
defineSlots<PropertyListSlots>();
</script>

<template>
  <dt v-bind="$attrs" class="kappa-property-list__term" data-slot="property-list-term"><slot /></dt>
</template>
