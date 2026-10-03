<script setup lang="ts">
import { computed } from "vue";
import {
  resolveTableStickyColumn,
  type TableHeadProps,
  type TableHeadSlots,
} from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableHeadProps>(), {
  sticky: undefined,
});

defineSlots<TableHeadSlots>();

const resolvedSticky = computed(() => resolveTableStickyColumn(props.sticky));
</script>

<template>
  <th
    v-bind="$attrs"
    class="kappa-table__head"
    data-slot="table-head"
    :data-sticky="resolvedSticky"
  >
    <slot />
  </th>
</template>
