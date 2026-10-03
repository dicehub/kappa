<script setup lang="ts">
import { computed } from "vue";
import {
  resolveTableStickyColumn,
  type TableCellProps,
  type TableCellSlots,
} from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableCellProps>(), {
  sticky: undefined,
});

defineSlots<TableCellSlots>();

const resolvedSticky = computed(() => resolveTableStickyColumn(props.sticky));
</script>

<template>
  <td
    v-bind="$attrs"
    class="kappa-table__cell"
    data-slot="table-cell"
    :data-sticky="resolvedSticky"
  >
    <slot />
  </td>
</template>
