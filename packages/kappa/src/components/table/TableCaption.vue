<script setup lang="ts">
import type { TableCaptionProps, TableCaptionSlots } from "./table";

defineOptions({ inheritAttrs: false });
defineProps<TableCaptionProps>();
defineSlots<TableCaptionSlots>();
</script>

<template>
  <caption v-bind="$attrs" class="kappa-table__caption" data-slot="table-caption">
    <slot />
  </caption>
</template>
