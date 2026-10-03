import DataGridRoot from "./DataGrid.vue";
import DataGridColumnVisibility from "./DataGridColumnVisibility.vue";
import DataGridContext from "./DataGridContext.vue";
import DataGridPagination from "./DataGridPagination.vue";

export const DataGrid = Object.assign(DataGridRoot, {
  Root: DataGridRoot,
  ColumnVisibility: DataGridColumnVisibility,
  Context: DataGridContext,
  Pagination: DataGridPagination,
});

export {
  DataGridColumnVisibility,
  DataGridContext,
  DataGridPagination,
  DataGridRoot,
};

export * from "./data-grid";
