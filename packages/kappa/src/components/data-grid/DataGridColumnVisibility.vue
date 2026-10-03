<script setup lang="ts">
import { computed } from "vue";
import { Dropdown } from "../dropdown";
import { useDataGridContext } from "./data-grid-context";
import type { DataGridColumnVisibilityProps } from "./data-grid";

const props = withDefaults(defineProps<DataGridColumnVisibilityProps>(), {
  label: "Columns",
});
const context = useDataGridContext();
const hideableColumns = computed(() => context.columns.filter((column) => column.hideable !== false));
</script>

<template>
  <Dropdown.Root aria-label="Visible columns" :positioning="{ placement: 'bottom-end' }">
    <Dropdown.Trigger class="kappa-data-grid__columns" data-slot="data-grid-column-visibility">
      {{ props.label }}
    </Dropdown.Trigger>
    <Dropdown.Context v-slot="menu">
      <Dropdown.Content :inert="!menu.open || undefined" class="kappa-data-grid__columns-menu">
        <Dropdown.Group>
          <Dropdown.CheckboxItem
            v-for="column in hideableColumns"
            :key="column.id"
            :checked="context.columnVisibility[column.id] !== false"
            :value="column.id"
            @checked-change="context.setColumnVisible(column.id, $event)"
          >{{ column.header }}</Dropdown.CheckboxItem>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Context>
  </Dropdown.Root>
</template>

<style src="./data-grid.css"></style>
