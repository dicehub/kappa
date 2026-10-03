<script setup lang="ts">
import type { TableBodyProps, TableBodySlots } from "./table";

defineOptions({ inheritAttrs: false });
defineProps<TableBodyProps>();
defineSlots<TableBodySlots>();
</script>

<template>
  <tbody v-bind="$attrs" class="kappa-table__body" data-slot="table-body">
    <slot />
  </tbody>
</template>
