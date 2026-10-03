<script setup lang="ts">
import { computed } from "vue";
import { Button } from "../button";
import { useDataGridContext } from "./data-grid-context";
import type { DataGridPaginationProps } from "./data-grid";

const props = withDefaults(defineProps<DataGridPaginationProps>(), {
  ariaLabel: "Data grid pages",
  showSummary: true,
});
const context = useDataGridContext();
const rangeStart = computed(() =>
  context.rowCount === 0 ? 0 : (context.page - 1) * context.pageSize + 1,
);
const rangeEnd = computed(() =>
  Math.min(context.page * context.pageSize, context.rowCount),
);
</script>

<template>
  <nav class="kappa-data-grid__pagination" data-slot="data-grid-pagination" :aria-label="props.ariaLabel">
    <span v-if="props.showSummary" class="kappa-data-grid__pagination-summary">
      {{ rangeStart }}–{{ rangeEnd }} of {{ context.rowCount }}
    </span>
    <div class="kappa-data-grid__pagination-controls">
      <Button
        aria-label="First page"
        :disabled="!context.canPreviousPage"
        shape="square"
        size="sm"
        variant="ghost"
        @click="context.firstPage"
      >«</Button>
      <Button
        aria-label="Previous page"
        :disabled="!context.canPreviousPage"
        shape="square"
        size="sm"
        variant="ghost"
        @click="context.previousPage"
      >‹</Button>
      <span class="kappa-data-grid__pagination-page">{{ context.page }} / {{ context.pageCount }}</span>
      <Button
        aria-label="Next page"
        :disabled="!context.canNextPage"
        shape="square"
        size="sm"
        variant="ghost"
        @click="context.nextPage"
      >›</Button>
      <Button
        aria-label="Last page"
        :disabled="!context.canNextPage"
        shape="square"
        size="sm"
        variant="ghost"
        @click="context.lastPage"
      >»</Button>
    </div>
  </nav>
</template>

<style src="./data-grid.css"></style>
