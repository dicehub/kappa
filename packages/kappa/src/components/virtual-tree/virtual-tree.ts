import type { CSSProperties, VNodeChild } from "vue";

export interface VirtualTreeNode<TData = unknown> {
  value: string;
  label: string;
  children?: VirtualTreeNode<TData>[];
  childrenCount?: number;
  disabled?: boolean;
  data?: TData;
}

export type VirtualTreeSelectionMode = "single" | "multiple";
export type VirtualTreeScrollAlign = "auto" | "center" | "end" | "start";
export type VirtualTreeMapper<T, R> = (node: T) => R;

export interface VirtualTreeProps<T = VirtualTreeNode> {
  /** Accessible name for the tree. */
  ariaLabel?: string;
  /** Initial expanded values for uncontrolled use. */
  defaultExpandedValue?: string[];
  /** Initial focused value for uncontrolled use. */
  defaultFocusedValue?: string;
  /** Initial selected values for uncontrolled use. */
  defaultSelectedValue?: string[];
  disabled?: boolean;
  /** Expand a branch when its row is clicked. */
  expandOnClick?: boolean;
  /** Controlled expanded values. */
  expandedValue?: string[];
  /** Controlled focused value. */
  focusedValue?: string | null;
  /** Height of the scroll viewport. */
  height?: CSSProperties["height"];
  id?: string;
  /** Indent per tree level in pixels. */
  indent?: number;
  isNodeDisabled?: VirtualTreeMapper<T, boolean>;
  items: readonly T[];
  /** Load children before an unloaded branch expands. */
  loadChildren?: (details: VirtualTreeLoadChildrenDetails<T>) => Promise<readonly T[]>;
  nodeToChildren?: VirtualTreeMapper<T, readonly T[] | undefined>;
  nodeToChildrenCount?: VirtualTreeMapper<T, number | undefined>;
  nodeToString?: VirtualTreeMapper<T, string>;
  nodeToValue?: VirtualTreeMapper<T, string>;
  /** Extra rows rendered above and below the viewport. */
  overscan?: number;
  /** Fixed row height in pixels. */
  rowHeight?: number;
  /** Controlled selected values. */
  selectedValue?: string[];
  selectionMode?: VirtualTreeSelectionMode;
  typeahead?: boolean;
}

export interface VirtualTreeLoadChildrenDetails<T> {
  node: T;
  value: string;
}

export interface VirtualTreeExpandedChangeDetails<T> {
  expanded: boolean;
  expandedValue: string[];
  node: T;
  value: string;
}

export interface VirtualTreeFocusChangeDetails<T> {
  focusedValue: string | null;
  node: T | null;
}

export interface VirtualTreeSelectionChangeDetails<T> {
  node: T;
  selectedValue: string[];
  value: string;
}

export interface VirtualTreeLoadChildrenCompleteDetails<T> {
  children: readonly T[];
  node: T;
  value: string;
}

export interface VirtualTreeLoadChildrenErrorDetails<T> {
  error: unknown;
  node: T;
  value: string;
}

export interface VirtualTreeEmits<T = VirtualTreeNode> {
  expandedChange: [details: VirtualTreeExpandedChangeDetails<T>];
  focusChange: [details: VirtualTreeFocusChangeDetails<T>];
  loadChildrenComplete: [details: VirtualTreeLoadChildrenCompleteDetails<T>];
  loadChildrenError: [details: VirtualTreeLoadChildrenErrorDetails<T>];
  selectionChange: [details: VirtualTreeSelectionChangeDetails<T>];
  "update:expandedValue": [value: string[]];
  "update:focusedValue": [value: string | null];
  "update:selectedValue": [value: string[]];
}

export interface VirtualTreeRowContext<T = VirtualTreeNode> {
  collapse: () => void;
  depth: number;
  expand: () => void;
  expanded: boolean;
  focused: boolean;
  hasChildren: boolean;
  loading: boolean;
  node: T;
  select: () => void;
  selected: boolean;
  toggle: () => void;
  value: string;
}

export interface VirtualTreeSlots<T = VirtualTreeNode> {
  default?: (context: VirtualTreeRowContext<T>) => VNodeChild;
  empty?: () => VNodeChild;
  indicator?: (context: VirtualTreeRowContext<T>) => VNodeChild;
}

export interface VirtualTreeApi<T = VirtualTreeNode> {
  collapse: (value: string, recursive?: boolean) => boolean;
  expand: (value: string, recursive?: boolean) => Promise<boolean>;
  focus: (value: string) => boolean;
  getNode: (value: string) => T | undefined;
  scrollToValue: (value: string, align?: VirtualTreeScrollAlign) => boolean;
}

export const VIRTUAL_TREE_DEFAULTS = {
  height: "20rem",
  indent: 16,
  overscan: 8,
  rowHeight: 28,
} as const;

export const defaultVirtualTreeNodeToValue = (node: unknown): string => {
  const value = (node as Partial<VirtualTreeNode> | null)?.value;
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError("VirtualTree nodes need a non-empty string value.");
  }
  return value;
};

export const defaultVirtualTreeNodeToString = (node: unknown): string =>
  String((node as Partial<VirtualTreeNode> | null)?.label ?? "");

export const defaultVirtualTreeNodeToChildren = (
  node: unknown,
): readonly unknown[] | undefined =>
  (node as Partial<VirtualTreeNode> | null)?.children;

export const defaultVirtualTreeNodeToChildrenCount = (
  node: unknown,
): number | undefined => (node as Partial<VirtualTreeNode> | null)?.childrenCount;

export const defaultVirtualTreeIsNodeDisabled = (node: unknown): boolean =>
  Boolean((node as Partial<VirtualTreeNode> | null)?.disabled);

export const resolveVirtualTreePositiveNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback;

export const resolveVirtualTreeOverscan = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(100, Math.max(0, Math.floor(value)))
    : VIRTUAL_TREE_DEFAULTS.overscan;
