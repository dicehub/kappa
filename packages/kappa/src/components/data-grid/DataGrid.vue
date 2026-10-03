<script setup lang="ts" generic="T">
import { functionalUpdate, useTable } from "@tanstack/vue-table";
import { useVirtualizer } from "@tanstack/vue-virtual";
import {
  computed,
  onMounted,
  reactive,
  ref,
  useTemplateRef,
  watch,
  watchEffect,
  type CSSProperties,
} from "vue";
import { Checkbox } from "../checkbox";
import {
  DATA_GRID_DEFAULTS,
  filterDataGridRows,
  resolveDataGridOverscan,
  resolveDataGridPositiveInteger,
  type DataGridCellContext,
  type DataGridColumn,
  type DataGridContextValue,
  type DataGridDirection,
  type DataGridEmits,
  type DataGridHeaderContext,
  type DataGridProps,
  type DataGridRowContext,
  type DataGridSlots,
  type DataGridSort,
} from "./data-grid";
import { provideDataGridContext } from "./data-grid-context";
import {
  DATA_GRID_DEFAULT_COLUMN_WIDTH,
  DATA_GRID_SELECTION_COLUMN_ID,
  createDataGridColumnDefs,
  dataGridFeatures,
  getDataGridPinnedStyle,
  type DataGridInternalRow,
} from "./data-grid-engine";
import { handleDataGridResizeKeydown } from "./data-grid-resize";
import { useDataGridState } from "./use-data-grid-state";
import {
  dataGridCellDirective as vDataGridCell,
  isDataGridInteractiveTarget,
  useDataGridFocus,
} from "./use-data-grid-focus";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DataGridProps<T>>(), {
  ariaLabel: "Data grid",
  compact: false,
  emptyLabel: DATA_GRID_DEFAULTS.emptyLabel,
  errorLabel: DATA_GRID_DEFAULTS.errorLabel,
  height: DATA_GRID_DEFAULTS.height,
  loading: false,
  loadingLabel: DATA_GRID_DEFAULTS.loadingLabel,
  manualFiltering: false,
  manualPagination: false,
  manualSorting: false,
  mode: DATA_GRID_DEFAULTS.mode,
  overscan: DATA_GRID_DEFAULTS.overscan,
  paginated: false,
  resizable: true,
  rowHeight: DATA_GRID_DEFAULTS.rowHeight,
  selectOnRowClick: true,
  selectionMode: DATA_GRID_DEFAULTS.selectionMode,
  showSelectionColumn: true,
  stickyHeader: true,
});
const emit = defineEmits<DataGridEmits<T>>();
const slots = defineSlots<DataGridSlots<T>>();

const clientRowCount = ref(props.rows.length);
const state = useDataGridState(props, computed(() => clientRowCount.value), {
  columnVisibilityChange: (value) => {
    emit("update:columnVisibility", value);
    emit("columnVisibilityChange", value);
  },
  filtersChange: (value) => {
    emit("update:filters", value);
    emit("filtersChange", value);
  },
  pageChange: (value) => {
    emit("update:page", value);
    emit("pageChange", value);
  },
  pageSizeChange: (value) => {
    emit("update:pageSize", value);
    emit("pageSizeChange", value);
  },
  queryChange: (value) => {
    emit("update:query", value);
    emit("queryChange", value);
  },
  selectionChange: (value, rows) => {
    emit("update:selectedValue", value);
    emit("selectionChange", { rows, selectedValue: value });
  },
  sortingChange: (value) => {
    emit("update:sorting", value);
    emit("sortingChange", value);
  },
});

const filteredRows = computed(() =>
  props.manualFiltering
    ? props.rows
    : filterDataGridRows(props.rows, props.columns, state.query.value, state.filters.value),
);
watchEffect(() => {
  clientRowCount.value = filteredRows.value.length;
});

const columnById = computed(
  () => new Map(props.columns.map((column) => [column.id, column] as const)),
);
const hasSelectionColumn = computed(() =>
  props.selectionMode !== "none" && props.showSelectionColumn,
);
const columnDefs = computed(() => createDataGridColumnDefs(props.columns, hasSelectionColumn.value));
const internalRows = computed(() => filteredRows.value as DataGridInternalRow<T>[]);
const rowSelection = computed(() =>
  Object.fromEntries(state.selectedValue.value.map((value) => [value, true] as const)),
);
const tableSorting = computed(() =>
  state.sorting.value.map((sort) => ({ desc: sort.direction === "desc", id: sort.id })),
);
const columnPinning = computed(() => ({
  end: props.columns.filter((column) => column.pinned === "end").map((column) => column.id),
  start: [
    ...(hasSelectionColumn.value ? [DATA_GRID_SELECTION_COLUMN_ID] : []),
    ...props.columns.filter((column) => column.pinned === "start").map((column) => column.id),
  ],
}));
const tableState = computed(() => ({
  columnPinning: columnPinning.value,
  columnVisibility: state.columnVisibility.value,
  pagination: { pageIndex: state.page.value - 1, pageSize: state.pageSize.value },
  rowSelection: rowSelection.value,
  sorting: tableSorting.value,
}));
const root = useTemplateRef<HTMLElement>("root");
const resizeDirection = ref<DataGridDirection>(props.direction ?? "ltr");
onMounted(() => {
  resizeDirection.value = props.direction ?? (getComputedStyle(root.value!).direction as DataGridDirection);
});
watch(() => props.direction, (value) => {
  resizeDirection.value = value ?? (root.value
    ? getComputedStyle(root.value).direction as DataGridDirection
    : "ltr");
});

const table = useTable<typeof dataGridFeatures, DataGridInternalRow<T>>({
  columnResizeDirection: resizeDirection,
  columnResizeMode: "onChange",
  columns: columnDefs,
  data: internalRows,
  enableColumnPinning: true,
  enableColumnResizing: computed(() => props.resizable),
  enableMultiRowSelection: computed(() => props.selectionMode === "multiple"),
  enableRowSelection: computed(() => props.selectionMode !== "none"),
  features: dataGridFeatures,
  getRowId: (row) => props.rowToValue(row),
  manualPagination: computed(() => !props.paginated || props.manualPagination),
  manualSorting: computed(() => props.manualSorting),
  onColumnVisibilityChange: (updater) => {
    state.setColumnVisibility(functionalUpdate(updater, state.columnVisibility.value));
  },
  onPaginationChange: (updater) => {
    const current = { pageIndex: state.page.value - 1, pageSize: state.pageSize.value };
    const next = functionalUpdate(updater, current);
    if (next.pageSize !== current.pageSize) state.setPageSize(next.pageSize);
    if (next.pageIndex !== current.pageIndex) state.setPage(next.pageIndex + 1);
  },
  onRowSelectionChange: (updater) => {
    const next = functionalUpdate(updater, rowSelection.value);
    state.setSelectedValue(Object.keys(next).filter((value) => next[value]));
  },
  onSortingChange: (updater) => {
    const next = functionalUpdate(updater, tableSorting.value);
    state.setSorting(next.map((sort) => ({
      direction: sort.desc ? "desc" : "asc",
      id: sort.id,
    })));
    state.setPage(1);
  },
  rowCount: state.rowCount,
  state: tableState,
});

const tableRows = computed(() => table.getRowModel().rows);
const viewport = useTemplateRef<HTMLElement>("viewport");
const rowHeight = computed(() =>
  resolveDataGridPositiveInteger(props.rowHeight, DATA_GRID_DEFAULTS.rowHeight),
);
const virtualizer = useVirtualizer(
  computed(() => ({
    count: props.mode === "virtual" ? tableRows.value.length : 0,
    estimateSize: () => rowHeight.value,
    getItemKey: (index: number) => tableRows.value[index]?.id ?? index,
    getScrollElement: () => viewport.value,
    isScrollingResetDelay: 300,
    overscan: resolveDataGridOverscan(props.overscan),
  })),
);
const renderedRows = computed(() =>
  props.mode === "virtual"
    ? virtualizer.value.getVirtualItems().map((item) => ({
        index: item.index,
        row: tableRows.value[item.index]!,
        size: item.size,
        start: item.start,
      }))
    : tableRows.value.map((row, index) => ({ index, row, size: undefined, start: undefined })),
);
const isVirtualScrolling = computed(() =>
  props.mode === "virtual" && !props.loading && virtualizer.value.isScrolling,
);

const viewportStyle = computed<CSSProperties>(() => ({
  "--kappa-data-grid-height": String(props.height),
  "--kappa-data-grid-row-height": `${rowHeight.value}px`,
}));
const tableStyle = computed<CSSProperties>(() => ({
  width: `${Math.max(table.getTotalSize(), 1)}px`,
}));
const bodyStyle = computed<CSSProperties>(() =>
  props.mode === "virtual"
    ? { height: `${virtualizer.value.getTotalSize()}px`, position: "relative" }
    : {},
);
const rowStyle = (record: (typeof renderedRows.value)[number]): CSSProperties =>
  props.mode === "virtual"
    ? {
        height: `${record.size}px`,
        position: "absolute",
        transform: `translateY(${record.start}px)`,
        width: "100%",
      }
    : {};

const context = reactive({
  canNextPage: state.canNextPage,
  canPreviousPage: state.canPreviousPage,
  columns: computed(() => props.columns),
  columnVisibility: state.columnVisibility,
  filters: state.filters,
  firstPage: state.firstPage,
  lastPage: state.lastPage,
  nextPage: state.nextPage,
  page: state.page,
  pageCount: state.pageCount,
  pageSize: state.pageSize,
  previousPage: state.previousPage,
  query: state.query,
  rowCount: state.rowCount,
  selectedValue: state.selectedValue,
  setColumnVisible: (id: string, visible: boolean) =>
    state.setColumnVisibility({ ...state.columnVisibility.value, [id]: visible }),
  setFilter: state.setFilter,
  setPage: state.setPage,
  setPageSize: state.setPageSize,
  setQuery: state.setQuery,
  sorting: state.sorting,
}) as DataGridContextValue<T>;
provideDataGridContext(context);

const getColumn = (id: string): DataGridColumn<T> | undefined => columnById.value.get(id);
const getCellContext = (record: (typeof renderedRows.value)[number], columnId: string) => {
  const column = getColumn(columnId)!;
  const value = record.row.getValue(columnId);
  return {
    column,
    columnId,
    row: record.row.original,
    rowIndex: record.index,
    rowValue: record.row.id,
    selected: record.row.getIsSelected(),
    value,
  } satisfies DataGridCellContext<T>;
};
const getRowContext = (record: (typeof renderedRows.value)[number]) => ({
  row: record.row.original,
  rowIndex: record.index,
  rowValue: record.row.id,
  selected: record.row.getIsSelected(),
  toggleSelected: () => record.row.toggleSelected(),
}) satisfies DataGridRowContext<T>;
const getHeaderContext = (header: ReturnType<typeof table.getLeafHeaders>[number]) => {
  const column = getColumn(header.column.id)!;
  const sorted = header.column.getIsSorted();
  return {
    column,
    columnId: header.column.id,
    direction: sorted || undefined,
    sortIndex: header.column.getSortIndex(),
    toggleSorting: (multi = false) => header.column.toggleSorting(undefined, multi),
  } satisfies DataGridHeaderContext<T>;
};
const formatCell = (context: DataGridCellContext<T>) =>
  context.column.format?.(context.value, context.row) ?? String(context.value ?? "");

const visibleColumns = computed(() => [
  ...table.getStartVisibleLeafColumns(),
  ...table.getCenterVisibleLeafColumns(),
  ...table.getEndVisibleLeafColumns(),
]);
const {
  focusedCell,
  handleCellFocusin,
  handleCellFocusout,
  handleCellKeydown,
  handleViewportScroll,
} = useDataGridFocus({
  columns: visibleColumns,
  mode: computed(() => props.mode),
  onCellActivate: (context: DataGridCellContext<T>) => emit("cellActivate", context),
  rowHeight,
  renderedRowIndexes: computed(() => renderedRows.value.map((record) => record.index)),
  rows: tableRows,
  scrollToIndex: (index) => virtualizer.value.scrollToIndex(index),
  viewport,
});
const handleRowClick = (event: MouseEvent, record: (typeof renderedRows.value)[number]) => {
  if (!props.selectOnRowClick || props.selectionMode === "none" || isDataGridInteractiveTarget(event.target)) return;
  record.row.toggleSelected();
};
const handleRowActivate = (record: (typeof renderedRows.value)[number]) =>
  emit("rowActivate", getRowContext(record));
const toggleAllRows = (checked: boolean) => table.toggleAllPageRowsSelected(checked);
const headerRowCount = computed(() => table.getHeaderGroups().length);
const dataRowOffset = computed(() => props.paginated ? (state.page.value - 1) * state.pageSize.value : 0);
const getAriaRowIndex = (record: (typeof renderedRows.value)[number]) =>
  headerRowCount.value + dataRowOffset.value + record.index + 1;
const getColumnMinimum = (id: string) => getColumn(id)?.minWidth ?? 64;
const getColumnMaximum = (id: string) => getColumn(id)?.maxWidth;
const resetColumnSize = (id: string) => {
  const size = getColumn(id)?.width ?? DATA_GRID_DEFAULT_COLUMN_WIDTH;
  table.setColumnSizing((current) => ({ ...current, [id]: size }));
};
const handleResizeKeydown = (
  event: KeyboardEvent,
  header: ReturnType<typeof table.getLeafHeaders>[number],
) => {
  const minimum = getColumnMinimum(header.column.id);
  const maximum = getColumnMaximum(header.column.id);
  handleDataGridResizeKeydown({
    currentSize: header.column.getSize(),
    direction: resizeDirection.value,
    event,
    maximum,
    minimum,
    reset: () => resetColumnSize(header.column.id),
    setSize: (size) => table.setColumnSizing((current) => ({ ...current, [header.column.id]: size })),
  });
};
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    class="kappa-data-grid"
    data-slot="data-grid"
    :data-compact="props.compact ? '' : undefined"
    :data-loading="props.loading ? '' : undefined"
    :data-mode="props.mode"
    :dir="props.direction"
  >
    <div v-if="slots.toolbar" class="kappa-data-grid__toolbar" data-slot="data-grid-toolbar">
      <slot name="toolbar" v-bind="context" />
    </div>

    <div class="kappa-data-grid__viewport-frame">
      <div
        ref="viewport"
        class="kappa-data-grid__viewport"
        data-slot="data-grid-viewport"
        :style="viewportStyle"
        @scroll.passive="handleViewportScroll"
      >
        <table
          class="kappa-data-grid__table"
          role="grid"
          :aria-busy="props.loading || undefined"
          :aria-label="props.ariaLabel"
          :aria-multiselectable="props.selectionMode === 'multiple' ? true : undefined"
          :aria-rowcount="state.rowCount.value + headerRowCount"
          :data-sticky-header="props.stickyHeader ? '' : undefined"
          :style="tableStyle"
        >
        <thead class="kappa-data-grid__header" data-slot="data-grid-header">
          <tr v-for="(headerGroup, headerRowIndex) in table.getHeaderGroups()" :key="headerGroup.id" :aria-rowindex="headerRowIndex + 1">
            <th
              v-for="(header, columnIndex) in headerGroup.headers"
              :key="header.id"
              :aria-sort="header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : undefined"
              :class="{ 'kappa-data-grid__cell--pinned': header.column.getIsPinned() }"
              :data-align="getColumn(header.column.id)?.align"
              :data-column-id="header.column.id"
              :data-grid-column-index="columnIndex"
              :style="getDataGridPinnedStyle(header.column)"
              scope="col"
            >
              <template v-if="header.column.id === DATA_GRID_SELECTION_COLUMN_ID">
                <Checkbox
                  v-if="props.selectionMode === 'multiple'"
                  :aria-label="table.getIsAllPageRowsSelected() ? 'Clear row selection' : 'Select all rows'"
                  :checked="table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false"
                  @checked-change="toggleAllRows($event.checked === true)"
                ><Checkbox.Control /></Checkbox>
                <span v-else class="kappa-data-grid__visually-hidden">Select row</span>
              </template>
              <template v-else>
                <button
                  v-if="header.column.getCanSort()"
                  class="kappa-data-grid__sort"
                  type="button"
                  @click="header.column.toggleSorting(undefined, $event.shiftKey)"
                >
                  <slot
                    :name="`header-${header.column.id}`"
                    v-bind="getHeaderContext(header)"
                  >
                    <slot name="header" v-bind="getHeaderContext(header)">
                      {{ getColumn(header.column.id)?.header }}
                    </slot>
                  </slot>
                  <span class="kappa-data-grid__sort-icon" aria-hidden="true">
                    {{ header.column.getIsSorted() === 'asc' ? '↑' : header.column.getIsSorted() === 'desc' ? '↓' : '↕' }}
                  </span>
                </button>
                <template v-else>
                  <slot :name="`header-${header.column.id}`" v-bind="getHeaderContext(header)">
                    <slot name="header" v-bind="getHeaderContext(header)">
                      {{ getColumn(header.column.id)?.header }}
                    </slot>
                  </slot>
                </template>
                <button
                  v-if="header.column.getCanResize()"
                  class="kappa-data-grid__resize"
                  type="button"
                  :aria-label="`Resize ${getColumn(header.column.id)?.header ?? header.column.id} column`"
                  :aria-valuemax="getColumnMaximum(header.column.id)"
                  :aria-valuemin="getColumnMinimum(header.column.id)"
                  :aria-valuenow="header.column.getSize()"
                  aria-orientation="vertical"
                  :data-resizing="header.column.getIsResizing() ? '' : undefined"
                  role="separator"
                  @dblclick="resetColumnSize(header.column.id)"
                  @mousedown="header.getResizeHandler()($event)"
                  @touchstart="header.getResizeHandler()($event)"
                  @keydown="handleResizeKeydown($event, header)"
                />
              </template>
            </th>
          </tr>
        </thead>

        <tbody class="kappa-data-grid__body" data-slot="data-grid-body" :style="bodyStyle">
          <tr
            v-for="record in renderedRows"
            :key="record.row.id"
            :aria-rowindex="getAriaRowIndex(record)"
            :aria-selected="props.selectionMode === 'none' ? undefined : record.row.getIsSelected()"
            :data-selected="record.row.getIsSelected() ? '' : undefined"
            :style="rowStyle(record)"
            @click="handleRowClick($event, record)"
            @dblclick="handleRowActivate(record)"
          >
            <td
              v-data-grid-cell
              v-for="(cell, columnIndex) in record.row.getVisibleCells()"
              :key="cell.id"
              :class="{ 'kappa-data-grid__cell--pinned': cell.column.getIsPinned() }"
              :data-align="getColumn(cell.column.id)?.align"
              :data-column-id="cell.column.id"
              :data-grid-column-index="columnIndex"
              :data-grid-row-index="record.index"
              :style="getDataGridPinnedStyle(cell.column)"
              :tabindex="focusedCell.rowValue === record.row.id && focusedCell.columnId === cell.column.id ? 0 : -1"
              @click="focusedCell = { rowValue: record.row.id, columnId: cell.column.id }"
              @focusin="handleCellFocusin"
              @focusout="handleCellFocusout"
              @keydown="handleCellKeydown($event, record.index, columnIndex, cell.column.id === DATA_GRID_SELECTION_COLUMN_ID ? undefined : getCellContext(record, cell.column.id))"
            >
              <template v-if="cell.column.id === DATA_GRID_SELECTION_COLUMN_ID">
                <Checkbox
                  :aria-label="`Select row ${getAriaRowIndex(record) - headerRowCount}`"
                  :checked="record.row.getIsSelected()"
                  @checked-change="record.row.toggleSelected($event.checked === true)"
                ><Checkbox.Control /></Checkbox>
              </template>
              <template v-else>
                <slot :name="`cell-${cell.column.id}`" v-bind="getCellContext(record, cell.column.id)">
                  <slot name="cell" v-bind="getCellContext(record, cell.column.id)">
                    {{ formatCell(getCellContext(record, cell.column.id)) }}
                  </slot>
                </slot>
              </template>
            </td>
          </tr>
        </tbody>
        </table>

        <div
          v-if="!props.loading && props.error"
          class="kappa-data-grid__state"
          data-slot="data-grid-error"
          role="alert"
        ><slot name="error" :error="props.error">{{ props.errorLabel }}</slot></div>
        <div
          v-else-if="!props.loading && tableRows.length === 0"
          class="kappa-data-grid__state"
          data-slot="data-grid-empty"
        ><slot name="empty">{{ props.emptyLabel }}</slot></div>
      </div>

      <div
        v-if="props.loading"
        class="kappa-data-grid__state kappa-data-grid__state--overlay"
        data-slot="data-grid-loading"
        role="status"
      ><slot name="loading"><span class="kappa-data-grid__spinner" aria-hidden="true" />{{ props.loadingLabel }}</slot></div>
      <div
        v-if="isVirtualScrolling"
        class="kappa-data-grid__scroll-loader"
        data-slot="data-grid-scroll-loading"
        aria-hidden="true"
      ><span class="kappa-data-grid__spinner" /></div>
    </div>

    <div v-if="slots.footer" class="kappa-data-grid__footer" data-slot="data-grid-footer">
      <slot name="footer" v-bind="context" />
    </div>
  </div>
</template>

<style src="./data-grid.css"></style>
