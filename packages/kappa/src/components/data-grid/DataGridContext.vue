<script setup lang="ts">
import { useDataGridContext } from "./data-grid-context";
import type { DataGridContextSlots } from "./data-grid";

defineSlots<DataGridContextSlots>();
const context = useDataGridContext();
</script>

<template>
  <slot v-bind="context" />
</template>
