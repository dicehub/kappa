import {
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
} from "@tanstack/vue-table";
import type { CSSProperties } from "vue";
import { getDataGridColumnValue, type DataGridColumn } from "./data-grid.ts";

export const dataGridFeatures = tableFeatures({
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

export type DataGridFeatures = typeof dataGridFeatures;
export type DataGridInternalRow<T> = T & Record<string, unknown>;

export const DATA_GRID_SELECTION_COLUMN_ID = "__kappa_selection";
export const DATA_GRID_DEFAULT_COLUMN_WIDTH = 160;

export const createDataGridColumnDefs = <T>(
  columns: readonly DataGridColumn<T>[],
  showSelectionColumn: boolean,
): Array<ColumnDef<DataGridFeatures, DataGridInternalRow<T>, unknown>> => {
  const definitions: Array<ColumnDef<DataGridFeatures, DataGridInternalRow<T>, unknown>> = columns.map((column) => ({
    accessorFn: (row: DataGridInternalRow<T>) => getDataGridColumnValue(column, row),
    enableHiding: column.hideable !== false,
    enablePinning: Boolean(column.pinned),
    enableResizing: column.resizable !== false,
    enableSorting: column.sortable !== false,
    header: column.header,
    id: column.id,
    maxSize: column.maxWidth,
    minSize: column.minWidth ?? 64,
    size: column.width ?? DATA_GRID_DEFAULT_COLUMN_WIDTH,
  }));

  if (!showSelectionColumn) return definitions;
  return [
    {
      enableHiding: false,
      enablePinning: true,
      enableResizing: false,
      enableSorting: false,
      header: "Select",
      id: DATA_GRID_SELECTION_COLUMN_ID,
      maxSize: 40,
      minSize: 40,
      size: 40,
    },
    ...definitions,
  ];
};

interface PinnableColumn {
  getAfter: (position?: "start" | "end" | "center" | false) => number;
  getIsPinned: () => false | "start" | "end";
  getSize: () => number;
  getStart: (position?: "start" | "end" | "center" | false) => number;
}

export const getDataGridPinnedStyle = (column: PinnableColumn): CSSProperties => {
  const pinned = column.getIsPinned();
  if (!pinned) return { width: `${column.getSize()}px` };
  return {
    insetInlineEnd: pinned === "end" ? `${column.getAfter("end")}px` : undefined,
    insetInlineStart: pinned === "start" ? `${column.getStart("start")}px` : undefined,
    position: "sticky",
    width: `${column.getSize()}px`,
    zIndex: 2,
  };
};
