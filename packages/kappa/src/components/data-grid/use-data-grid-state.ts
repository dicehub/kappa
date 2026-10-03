import { computed, ref, watch, type ComputedRef } from "vue";
import {
  DATA_GRID_DEFAULTS,
  resolveDataGridPositiveInteger,
  type DataGridColumnVisibility,
  type DataGridFilters,
  type DataGridProps,
  type DataGridSort,
} from "./data-grid";

interface DataGridStateHandlers<T> {
  columnVisibilityChange: (value: DataGridColumnVisibility) => void;
  filtersChange: (value: DataGridFilters) => void;
  pageChange: (value: number) => void;
  pageSizeChange: (value: number) => void;
  queryChange: (value: string) => void;
  selectionChange: (value: string[], rows: T[]) => void;
  sortingChange: (value: DataGridSort[]) => void;
}

export function useDataGridState<T>(
  props: Readonly<DataGridProps<T>>,
  clientRowCount: ComputedRef<number>,
  handlers: DataGridStateHandlers<T>,
) {
  const internalSelectedValue = ref([...(props.defaultSelectedValue ?? [])]);
  const internalSorting = ref<DataGridSort[]>([...(props.defaultSorting ?? [])]);
  const internalColumnVisibility = ref<DataGridColumnVisibility>({
    ...(props.defaultColumnVisibility ?? {}),
  });
  const internalQuery = ref(props.defaultQuery ?? "");
  const internalFilters = ref<DataGridFilters>({ ...(props.defaultFilters ?? {}) });
  const internalPage = ref(
    resolveDataGridPositiveInteger(props.defaultPage, DATA_GRID_DEFAULTS.defaultPage),
  );
  const internalPageSize = ref(
    resolveDataGridPositiveInteger(props.defaultPageSize, DATA_GRID_DEFAULTS.defaultPageSize),
  );

  const selectedValue = computed(() => props.selectedValue ?? internalSelectedValue.value);
  const sorting = computed(() => props.sorting ?? internalSorting.value);
  const columnVisibility = computed(
    () => props.columnVisibility ?? internalColumnVisibility.value,
  );
  const query = computed(() => props.query ?? internalQuery.value);
  const filters = computed(() => props.filters ?? internalFilters.value);
  const page = computed(() =>
    resolveDataGridPositiveInteger(
      props.page ?? internalPage.value,
      DATA_GRID_DEFAULTS.defaultPage,
    ),
  );
  const pageSize = computed(() =>
    resolveDataGridPositiveInteger(
      props.pageSize ?? internalPageSize.value,
      DATA_GRID_DEFAULTS.defaultPageSize,
    ),
  );
  const rowCount = computed(() =>
    Math.max(0, props.rowCount ?? clientRowCount.value),
  );
  const pageCount = computed(() =>
    props.paginated === false ? 1 : Math.max(1, Math.ceil(rowCount.value / pageSize.value)),
  );

  const setSelectedValue = (value: string[]) => {
    const normalized = props.selectionMode === "single" ? value.slice(-1) : [...new Set(value)];
    if (props.selectedValue === undefined) internalSelectedValue.value = normalized;
    const selected = new Set(normalized);
    handlers.selectionChange(normalized, props.rows.filter((row) => selected.has(props.rowToValue(row))));
  };

  const setSorting = (value: DataGridSort[]) => {
    if (props.sorting === undefined) internalSorting.value = value;
    handlers.sortingChange(value);
  };

  const setColumnVisibility = (value: DataGridColumnVisibility) => {
    if (props.columnVisibility === undefined) internalColumnVisibility.value = value;
    handlers.columnVisibilityChange(value);
  };

  const setQuery = (value: string) => {
    if (props.query === undefined) internalQuery.value = value;
    handlers.queryChange(value);
    setPage(1);
  };

  const setFilters = (value: DataGridFilters) => {
    if (props.filters === undefined) internalFilters.value = value;
    handlers.filtersChange(value);
    setPage(1);
  };

  const setFilter = (id: string, value: unknown) => {
    const next = { ...filters.value };
    if (value === undefined || value === null || value === "") delete next[id];
    else next[id] = value;
    setFilters(next);
  };

  function setPage(value: number) {
    const normalized = Math.min(
      pageCount.value,
      resolveDataGridPositiveInteger(value, DATA_GRID_DEFAULTS.defaultPage),
    );
    if (props.page === undefined) internalPage.value = normalized;
    handlers.pageChange(normalized);
  }

  watch(pageCount, (value) => {
    if (page.value > value) setPage(value);
  });

  const setPageSize = (value: number) => {
    const normalized = resolveDataGridPositiveInteger(value, DATA_GRID_DEFAULTS.defaultPageSize);
    if (props.pageSize === undefined) internalPageSize.value = normalized;
    handlers.pageSizeChange(normalized);
    setPage(1);
  };

  return {
    canNextPage: computed(() => page.value < pageCount.value),
    canPreviousPage: computed(() => page.value > 1),
    columnVisibility,
    filters,
    firstPage: () => setPage(1),
    lastPage: () => setPage(pageCount.value),
    nextPage: () => setPage(page.value + 1),
    page,
    pageCount,
    pageSize,
    previousPage: () => setPage(page.value - 1),
    query,
    rowCount,
    selectedValue,
    setColumnVisibility,
    setFilter,
    setFilters,
    setPage,
    setPageSize,
    setQuery,
    setSelectedValue,
    setSorting,
    sorting,
  };
}
