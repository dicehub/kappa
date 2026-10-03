import type { VNodeChild } from "vue";

export type FilterBarView = "list" | "grid";
export type FilterBarSortDirection = "asc" | "desc";

export interface FilterBarSortOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterBarLabels {
  root: string;
  search: string;
  searchPlaceholder: string;
  sort: string;
  ascending: string;
  descending: string;
  view: string;
  list: string;
  grid: string;
}

export const FILTER_BAR_DEFAULT_LABELS: FilterBarLabels = {
  root: "Filter resources",
  search: "Search resources",
  searchPlaceholder: "Filter by name...",
  sort: "Sort by",
  ascending: "Sort ascending",
  descending: "Sort descending",
  view: "Resource view",
  list: "List view",
  grid: "Grid view",
};

export interface FilterBarProps {
  /** Controlled search value. Use v-model. */
  modelValue?: string;
  /** Initial search value when uncontrolled. */
  defaultValue?: string;
  /** Hide search when the page supplies a separate search control. */
  showSearch?: boolean;
  /** Sorting controls are shown when this array is nonempty. */
  sortOptions?: readonly FilterBarSortOption[];
  /** Controlled sort field. Unknown values remain visible as plain text. */
  sortBy?: string;
  /** Initial sort field; otherwise uses the first enabled option. */
  defaultSortBy?: string;
  sortDirection?: FilterBarSortDirection;
  defaultSortDirection?: FilterBarSortDirection;
  /** Show a single-selection list/grid toggle. */
  showView?: boolean;
  view?: FilterBarView;
  defaultView?: FilterBarView;
  /** Disables built-in controls. Slots receive this state for their own controls. */
  disabled?: boolean;
  /** Replace any visible or accessible label for the current locale. */
  labels?: Partial<FilterBarLabels>;
}

export type FilterBarEmits = {
  "update:modelValue": [value: string];
  "update:sortBy": [value: string];
  "update:sortDirection": [value: FilterBarSortDirection];
  "update:view": [value: FilterBarView];
};

export interface FilterBarSlots {
  filters?: (props: { disabled: boolean }) => VNodeChild;
  actions?: (props: { disabled: boolean }) => VNodeChild;
}
