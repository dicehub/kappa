<script setup lang="ts">
import type { PropertyListSlots } from "./property-list";
defineOptions({ inheritAttrs: false });
defineSlots<PropertyListSlots>();
</script>

<template>
  <dd v-bind="$attrs" class="kappa-property-list__value" data-slot="property-list-value"><slot /></dd>
</template>
