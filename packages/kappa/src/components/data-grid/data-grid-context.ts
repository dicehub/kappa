import { inject, provide, type InjectionKey } from "vue";
import type { DataGridContextValue } from "./data-grid";

const DATA_GRID_CONTEXT_KEY: InjectionKey<DataGridContextValue<unknown>> =
  Symbol("kappa-data-grid-context");

export const provideDataGridContext = <T>(context: DataGridContextValue<T>) => {
  provide(DATA_GRID_CONTEXT_KEY, context as DataGridContextValue<unknown>);
};

export const useDataGridContext = <T = unknown>(): DataGridContextValue<T> => {
  const context = inject(DATA_GRID_CONTEXT_KEY);
  if (!context) {
    throw new Error("DataGrid compound parts must be used inside DataGrid.Root.");
  }
  return context as DataGridContextValue<T>;
};
