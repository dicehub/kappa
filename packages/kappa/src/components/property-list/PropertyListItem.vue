<script setup lang="ts">
import PropertyListTerm from "./PropertyListTerm.vue";
import PropertyListValue from "./PropertyListValue.vue";
import type { PropertyListItemProps, PropertyListItemSlots } from "./property-list";
defineOptions({ inheritAttrs: false });
defineProps<PropertyListItemProps>();
defineSlots<PropertyListItemSlots>();
</script>

<template>
  <div v-bind="$attrs" class="kappa-property-list__item" data-slot="property-list-item">
    <template v-if="label !== undefined || $slots.label">
      <PropertyListTerm><slot name="label">{{ label }}</slot></PropertyListTerm>
      <PropertyListValue><slot /></PropertyListValue>
    </template>
    <slot v-else />
  </div>
</template>
