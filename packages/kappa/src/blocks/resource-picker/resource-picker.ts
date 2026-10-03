import type { VNodeChild } from "vue";

export interface ResourcePickerItem {
  /** Stable resource identifier. Values must be unique. */
  value: string;
  label: string;
  description?: string;
  meta?: string;
  /** Additional terms included in local search. */
  keywords?: string[];
  disabled?: boolean;
}

export type ResourcePickerSelectionMode = "single" | "multiple";
export type ResourcePickerFilterMode = "local" | "external";

export interface ResourcePickerLabels {
  trigger: string;
  search: string;
  searchPlaceholder: string;
  confirm: string;
  cancel: string;
  close: string;
  loading: string;
  emptyTitle: string;
  emptyDescription: string;
  errorTitle: string;
  retry: string;
  selectionCount: (count: number) => string;
}

export const RESOURCE_PICKER_DEFAULT_LABELS: ResourcePickerLabels = {
  trigger: "Choose resource",
  search: "Search resources",
  searchPlaceholder: "Search by name…",
  confirm: "Select",
  cancel: "Cancel",
  close: "Close resource picker",
  loading: "Loading resources…",
  emptyTitle: "No resources found",
  emptyDescription: "Try another search or check the available resources.",
  errorTitle: "Could not load resources",
  retry: "Try again",
  selectionCount: count => `${count} selected`,
};

export interface ResourcePickerProps {
  items: ResourcePickerItem[];
  /** Accessible dialog and list title. */
  title?: string;
  description?: string;
  open?: boolean;
  defaultOpen?: boolean;
  /** Committed IDs; only changes after the confirm action. */
  modelValue?: string[];
  defaultValue?: string[];
  selectionMode?: ResourcePickerSelectionMode;
  /** External mode renders the provided results without filtering them again. */
  filterMode?: ResourcePickerFilterMode;
  loading?: boolean;
  /** A non-empty message replaces the results with an error state. */
  error?: string;
  /** Permits confirming an empty selection. */
  allowEmpty?: boolean;
  disabled?: boolean;
  labels?: Partial<ResourcePickerLabels>;
}

export type ResourcePickerEmits = {
  "update:open": [open: boolean];
  "update:modelValue": [value: string[]];
  /** Fires for search changes. Debounce and fetch in the consumer. */
  searchChange: [query: string];
  confirm: [value: string[]];
  /** Fires when dismissed without confirmation, including Escape and outside click. */
  cancel: [];
  retry: [];
};

export interface ResourcePickerSlots {
  /** Supply one button; Dialog.Trigger supplies its behavior and ARIA attributes. */
  trigger?: () => VNodeChild;
  /** Decorative media shown before each resource name. */
  media?: (props: { item: ResourcePickerItem }) => VNodeChild;
  /** Additional non-interactive content below each resource name. */
  description?: (props: { item: ResourcePickerItem }) => VNodeChild;
  meta?: (props: { item: ResourcePickerItem }) => VNodeChild;
  empty?: (props: { query: string }) => VNodeChild;
  loading?: () => VNodeChild;
  error?: (props: { message: string; retry: () => void }) => VNodeChild;
  selection?: (props: { value: string[] }) => VNodeChild;
}
