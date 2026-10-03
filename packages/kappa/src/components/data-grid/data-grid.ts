import type { CSSProperties, VNodeChild } from "vue";

export type DataGridMode = "standard" | "virtual";
export type DataGridSelectionMode = "none" | "single" | "multiple";
export type DataGridSortDirection = "asc" | "desc";
export type DataGridColumnAlign = "start" | "center" | "end";
export type DataGridColumnPin = "start" | "end";
export type DataGridDirection = "ltr" | "rtl";

export interface DataGridSort {
  id: string;
  direction: DataGridSortDirection;
}

export type DataGridFilters = Record<string, unknown>;
export type DataGridColumnVisibility = Record<string, boolean>;

export interface DataGridColumn<T> {
  /** Stable column identifier. */
  id: string;
  /** Visible column heading. */
  header: string;
  /** Object key used when no accessor is supplied. */
  accessorKey?: keyof T;
  /** Resolve the value for this column. */
  accessor?: (row: T) => unknown;
  /** Cell alignment. */
  align?: DataGridColumnAlign;
  /** Match this column against a controlled filter value. */
  filter?: (value: unknown, row: T, filterValue: unknown) => boolean;
  /** Format a value when no named cell slot is supplied. */
  format?: (value: unknown, row: T) => string | number | null | undefined;
  /** Allow this column to be hidden. */
  hideable?: boolean;
  /** Include this column in client-side query matching. */
  searchable?: boolean;
  /** Allow pointer resizing. */
  resizable?: boolean;
  /** Allow sorting. */
  sortable?: boolean;
  /** Preferred width in pixels. */
  width?: number;
  /** Minimum width in pixels. */
  minWidth?: number;
  /** Maximum width in pixels. */
  maxWidth?: number;
  /** Pin this column to a logical viewport edge. */
  pinned?: DataGridColumnPin;
}

export interface DataGridProps<T> {
  /** Accessible name for the grid. */
  ariaLabel?: string;
  columns: readonly DataGridColumn<T>[];
  rows: readonly T[];
  /** Stable row identity. Replace the row or array when cell data changes. */
  rowToValue: (row: T) => string;
  /** Resize direction. When omitted, Kappa reads the rendered CSS direction. */
  direction?: DataGridDirection;
  mode?: DataGridMode;
  selectionMode?: DataGridSelectionMode;
  /** Show the leading selection checkbox column when selection is enabled. */
  showSelectionColumn?: boolean;
  selectedValue?: string[];
  defaultSelectedValue?: string[];
  sorting?: DataGridSort[];
  defaultSorting?: DataGridSort[];
  columnVisibility?: DataGridColumnVisibility;
  defaultColumnVisibility?: DataGridColumnVisibility;
  query?: string;
  defaultQuery?: string;
  filters?: DataGridFilters;
  defaultFilters?: DataGridFilters;
  paginated?: boolean;
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  defaultPageSize?: number;
  rowCount?: number;
  manualFiltering?: boolean;
  manualSorting?: boolean;
  manualPagination?: boolean;
  loading?: boolean;
  error?: unknown;
  compact?: boolean;
  stickyHeader?: boolean;
  resizable?: boolean;
  height?: CSSProperties["height"];
  rowHeight?: number;
  overscan?: number;
  emptyLabel?: string;
  loadingLabel?: string;
  errorLabel?: string;
  selectOnRowClick?: boolean;
}

export interface DataGridCellContext<T> {
  column: DataGridColumn<T>;
  columnId: string;
  row: T;
  rowIndex: number;
  rowValue: string;
  value: unknown;
  selected: boolean;
}

export interface DataGridHeaderContext<T> {
  column: DataGridColumn<T>;
  columnId: string;
  direction: DataGridSortDirection | undefined;
  sortIndex: number;
  toggleSorting: (multi?: boolean) => void;
}

export interface DataGridRowContext<T> {
  row: T;
  rowIndex: number;
  rowValue: string;
  selected: boolean;
  toggleSelected: () => void;
}

export interface DataGridContextValue<T = unknown> {
  columns: readonly DataGridColumn<T>[];
  columnVisibility: DataGridColumnVisibility;
  filters: DataGridFilters;
  page: number;
  pageCount: number;
  pageSize: number;
  query: string;
  rowCount: number;
  selectedValue: string[];
  sorting: DataGridSort[];
  canNextPage: boolean;
  canPreviousPage: boolean;
  firstPage: () => void;
  lastPage: () => void;
  nextPage: () => void;
  previousPage: () => void;
  setColumnVisible: (id: string, visible: boolean) => void;
  setFilter: (id: string, value: unknown) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setQuery: (query: string) => void;
}

export interface DataGridSlots<T> {
  toolbar?: (context: DataGridContextValue<T>) => VNodeChild;
  footer?: (context: DataGridContextValue<T>) => VNodeChild;
  empty?: () => VNodeChild;
  loading?: () => VNodeChild;
  error?: (context: { error: unknown }) => VNodeChild;
  cell?: (context: DataGridCellContext<T>) => VNodeChild;
  header?: (context: DataGridHeaderContext<T>) => VNodeChild;
  [name: `cell-${string}`]: ((context: DataGridCellContext<T>) => VNodeChild) | undefined;
  [name: `header-${string}`]: ((context: DataGridHeaderContext<T>) => VNodeChild) | undefined;
}

export interface DataGridEmits<T> {
  cellActivate: [details: DataGridCellContext<T>];
  rowActivate: [details: DataGridRowContext<T>];
  selectionChange: [details: { selectedValue: string[]; rows: T[] }];
  sortingChange: [sorting: DataGridSort[]];
  pageChange: [page: number];
  pageSizeChange: [pageSize: number];
  queryChange: [query: string];
  filtersChange: [filters: DataGridFilters];
  columnVisibilityChange: [visibility: DataGridColumnVisibility];
  "update:selectedValue": [value: string[]];
  "update:sorting": [value: DataGridSort[]];
  "update:page": [value: number];
  "update:pageSize": [value: number];
  "update:query": [value: string];
  "update:filters": [value: DataGridFilters];
  "update:columnVisibility": [value: DataGridColumnVisibility];
}

export interface DataGridContextSlots<T = unknown> {
  default?: (context: DataGridContextValue<T>) => VNodeChild;
}

export interface DataGridPaginationProps {
  /** Show the row range and total count. */
  showSummary?: boolean;
  /** Accessible name for the pagination region. */
  ariaLabel?: string;
}

export interface DataGridColumnVisibilityProps {
  /** Menu button label. */
  label?: string;
}

export const DATA_GRID_DEFAULTS = {
  defaultPage: 1,
  defaultPageSize: 25,
  emptyLabel: "No results",
  errorLabel: "Data could not be loaded",
  height: "28rem",
  loadingLabel: "Loading data",
  mode: "standard",
  overscan: 8,
  rowHeight: 36,
  selectionMode: "none",
} as const;

export const resolveDataGridPositiveInteger = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.max(1, Math.floor(value))
    : fallback;

export const resolveDataGridOverscan = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(100, Math.floor(value)))
    : DATA_GRID_DEFAULTS.overscan;

export const getDataGridColumnValue = <T>(column: DataGridColumn<T>, row: T): unknown => {
  if (column.accessor) return column.accessor(row);
  if (column.accessorKey !== undefined) return row[column.accessorKey];
  return undefined;
};

export const filterDataGridRows = <T>(
  rows: readonly T[],
  columns: readonly DataGridColumn<T>[],
  query: string,
  filters: DataGridFilters,
): readonly T[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const columnById = new Map(columns.map((column) => [column.id, column] as const));
  const activeFilters = Object.entries(filters).filter(([, value]) =>
    value !== undefined && value !== null && value !== "",
  );
  if (!normalizedQuery && activeFilters.length === 0) return rows;

  return rows.filter((row) => {
    const matchesFilters = activeFilters.every(([id, filterValue]) => {
      const column = columnById.get(id);
      if (!column) return true;
      const value = getDataGridColumnValue(column, row);
      return column.filter
        ? column.filter(value, row, filterValue)
        : String(value ?? "").toLocaleLowerCase().includes(String(filterValue).toLocaleLowerCase());
    });
    if (!matchesFilters || !normalizedQuery) return matchesFilters;
    return columns.some((column) =>
      column.searchable !== false &&
      String(getDataGridColumnValue(column, row) ?? "").toLocaleLowerCase().includes(normalizedQuery),
    );
  });
};
