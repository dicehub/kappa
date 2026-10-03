<script setup lang="ts">
import type { PropertyListProps, PropertyListSlots } from "./property-list";
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<PropertyListProps>(), { size: "base", layout: "horizontal", divided: false });
defineSlots<PropertyListSlots>();
</script>

<template>
  <dl v-bind="$attrs" class="kappa-property-list" data-slot="property-list"
    :data-size="size" :data-layout="layout" :data-divided="divided ? '' : undefined">
    <slot />
  </dl>
</template>

<style src="./property-list.css"></style>
