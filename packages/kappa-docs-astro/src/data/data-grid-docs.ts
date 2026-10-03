export const previewCode = `<script setup lang="ts">
import { ref } from "vue";
import {
  Badge,
  DataGrid,
  Input,
  type DataGridColumn,
  type DataGridSort,
} from "@dicehub/kappa";

type RecordRow = { id: string; name: string; owner: string; status: string };
const rows = ref<RecordRow[]>([]);
const query = ref("");
const selected = ref<string[]>([]);
const sorting = ref<DataGridSort[]>([]);
const rowToValue = (row: RecordRow) => row.id;
const columns: DataGridColumn<RecordRow>[] = [
  { id: "name", header: "Name", accessorKey: "name", pinned: "start", width: 220 },
  { id: "owner", header: "Owner", accessorKey: "owner", width: 160 },
  { id: "status", header: "Status", accessorKey: "status", width: 120 },
];
</script>

<template>
  <DataGrid
    v-model:query="query"
    v-model:selected-value="selected"
    v-model:sorting="sorting"
    :columns="columns"
    :rows="rows"
    :row-to-value="rowToValue"
    selection-mode="multiple"
    paginated
  >
    <template #toolbar>
      <Input v-model="query" aria-label="Search records" />
      <DataGrid.ColumnVisibility />
    </template>
    <template #cell-status="{ value }"><Badge>{{ value }}</Badge></template>
    <template #footer><DataGrid.Pagination /></template>
  </DataGrid>
</template>`;

export const virtualCode = `<DataGrid
  :columns="columns"
  :rows="oneHundredThousandRows"
  :row-to-value="rowToValue"
  mode="virtual"
  height="32rem"
  :row-height="28"
  :overscan="10"
  compact
/>`;

export const controlledCode = `<DataGrid
  v-model:page="page"
  v-model:page-size="pageSize"
  v-model:sorting="sorting"
  v-model:query="query"
  :columns="columns"
  :rows="currentServerPage"
  :row-count="totalCount"
  :row-to-value="rowToValue"
  manual-filtering
  manual-pagination
  manual-sorting
  paginated
  @page-change="loadPage"
  @sorting-change="loadPage"
  @query-change="loadPage"
/>`;

export const stateCode = `<DataGrid :columns="columns" :rows="[]" :row-to-value="rowToValue" loading />
<DataGrid :columns="columns" :rows="[]" :row-to-value="rowToValue" />
<DataGrid :columns="columns" :rows="[]" :row-to-value="rowToValue" :error="loadError" />`;

export const multilineCode = `<DataGrid :columns="columns" :rows="rows" :row-to-value="rowToValue">
  <template #cell-name="{ row }">
    <div><strong>{{ row.name }}</strong><p>{{ row.description }}</p></div>
  </template>
</DataGrid>`;

export const rowSelectionCode = `<DataGrid
  v-model:selected-value="selected"
  :columns="columns"
  :rows="rows"
  :row-to-value="rowToValue"
  selection-mode="multiple"
  :show-selection-column="false"
/>`;

export const examples = [
  { id: "virtual", title: "100,000 rows", variant: "virtual", description: "Virtual mode keeps a small, overscanned row window in the DOM. It requires a fixed row height and a constrained viewport height.", code: virtualCode },
  { id: "controlled", title: "Server-controlled state", variant: "controlled", description: "This deterministic server simulation owns search, sorting, paging, and the total row count. No live service is required.", code: controlledCode },
  { id: "row-selection", title: "Row-click selection", variant: "row-selection", description: "Keep selection without a leading checkbox column. Clicking a row toggles its selected state.", code: rowSelectionCode },
  { id: "compact", title: "Compact", variant: "compact", description: "Compact mode reduces the row rhythm for information-dense applications.", code: '<DataGrid compact :columns="columns" :rows="rows" :row-to-value="rowToValue" />' },
  { id: "multiline", title: "Multiline rows", variant: "multiline", description: "Standard mode keeps native table flow, so rich cells can increase the row height.", code: multilineCode },
  { id: "states", title: "Loading, empty, and error", variant: "states", description: "Use complete asynchronous states without replacing the grid shell.", code: stateCode },
] as const;

export const props = [
  ["rows", "readonly T[]", "—", "Rows for the current client data set or server page."],
  ["columns", "DataGridColumn<T>[]", "—", "Kappa-owned column definitions."],
  ["rowToValue", "(row: T) => string", "—", "Stable row identifier used for selection and virtualization."],
  ["direction", '"ltr" | "rtl"', "inherited", "Pointer and keyboard resize direction. CSS direction is detected when omitted."],
  ["mode", '"standard" | "virtual"', '"standard"', "Natural-height or fixed-row virtual rendering."],
  ["selectionMode", '"none" | "single" | "multiple"', '"none"', "Row selection behavior."],
  ["showSelectionColumn", "boolean", "true", "Show the leading checkbox column when selection is enabled."],
  ["sorting / defaultSorting", "DataGridSort[]", "[]", "Controlled sorting or its uncontrolled initial value."],
  ["selectedValue / defaultSelectedValue", "string[]", "[]", "Controlled selection or its uncontrolled initial value."],
  ["query / filters", "string / Record<string, unknown>", '"" / {}', "Client filter state. Use manualFiltering for server data."],
  ["paginated", "boolean", "false", "Enable page slicing and pagination context."],
  ["page / pageSize / rowCount", "number", "1 / 25 / rows.length", "One-based controlled paging state."],
  ["manualFiltering / manualSorting / manualPagination", "boolean", "false", "Keep the matching data operation in the application."],
  ["height / rowHeight / overscan", "CSS height / number / number", '"28rem" / 36 / 8', "Virtual viewport geometry."],
  ["loading / error", "boolean / unknown", "false / undefined", "Asynchronous state."],
] as const;
