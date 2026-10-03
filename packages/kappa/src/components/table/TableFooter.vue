<script setup lang="ts">
import type { TableFooterProps, TableFooterSlots } from "./table";

defineOptions({ inheritAttrs: false });
defineProps<TableFooterProps>();
defineSlots<TableFooterSlots>();
</script>

<template>
  <tfoot v-bind="$attrs" class="kappa-table__footer" data-slot="table-footer">
    <slot />
  </tfoot>
</template>
