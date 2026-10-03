import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
  VNodeChild,
} from "vue";
import type { CheckboxCheckedChangeDetails } from "../checkbox";

export const TABLE_VARIANTS = {
  layout: {
    auto: {
      description: "Columns size themselves from their content.",
    },
    fixed: {
      description: "Columns use the fixed table algorithm and colgroup widths.",
    },
  },
  variant: {
    default: {
      description: "Alternating row surfaces for dense data.",
    },
    selected: {
      description: "A semantic tint surface for a selected row.",
    },
  },
  sticky: {
    left: {
      description: "Pin a cell to the inline-start edge of its scroll container.",
    },
    right: {
      description: "Pin a cell to the inline-end edge of its scroll container.",
    },
  },
} as const;

export const TABLE_LAYOUTS = ["auto", "fixed"] as const;
export const TABLE_ROW_VARIANTS = ["default", "selected"] as const;
export const TABLE_STICKY_COLUMNS = ["left", "right"] as const;
export const TABLE_HEADER_VARIANTS = ["default", "compact"] as const;

export const TABLE_DEFAULT_VARIANTS = {
  layout: "auto",
  variant: "default",
  compact: false,
} as const;

export const TABLE_DEFAULT_HEADER_VARIANT = "default" as const;

export type TableLayout = (typeof TABLE_LAYOUTS)[number];
export type TableRowVariant = (typeof TABLE_ROW_VARIANTS)[number];
export type TableStickyColumn = (typeof TABLE_STICKY_COLUMNS)[number];
export type TableHeaderVariant = (typeof TABLE_HEADER_VARIANTS)[number];

export type TableCheckboxChangeDetails = {
  checked: boolean;
  eventDetails?: CheckboxCheckedChangeDetails;
};

export interface TableRootProps
  extends /* @vue-ignore */ Omit<TableHTMLAttributes, "layout"> {
  /** Use 12px text and reduced cell padding throughout the table. */
  compact?: boolean;
  /** Table layout algorithm. Use fixed with a colgroup for explicit widths. */
  layout?: TableLayout;
}

export type TableProps = TableRootProps;

export interface TableCaptionProps extends /* @vue-ignore */ HTMLAttributes {}

export interface TableHeaderProps extends /* @vue-ignore */ HTMLAttributes {
  /** Use a denser header rhythm for high-volume tables. */
  variant?: TableHeaderVariant;
  /** Pin header cells to the top of the table's scrolling parent. */
  sticky?: boolean;
}

export interface TableBodyProps extends /* @vue-ignore */ HTMLAttributes {}

export interface TableRowProps extends /* @vue-ignore */ HTMLAttributes {
  /** Applies the selected row surface when set to selected. */
  variant?: TableRowVariant;
}

export interface TableHeadProps extends /* @vue-ignore */ ThHTMLAttributes {
  /** Pin this header cell to an edge of the horizontal scroll container. */
  sticky?: TableStickyColumn;
}

export interface TableCellProps extends /* @vue-ignore */ TdHTMLAttributes {
  /** Pin this body cell to an edge of the horizontal scroll container. */
  sticky?: TableStickyColumn;
}

export interface TableFooterProps extends /* @vue-ignore */ HTMLAttributes {}

export interface TableCheckHeadProps extends TableHeadProps {
  /** Controlled checked state for the select-all checkbox. */
  checked?: boolean;
  /** Shows the mixed selection state. */
  indeterminate?: boolean;
  /** Disables the select-all checkbox. */
  disabled?: boolean;
  /** Accessible name for the select-all checkbox. */
  label?: string;
}

export interface TableCheckCellProps extends TableCellProps {
  /** Controlled checked state for the row checkbox. */
  checked?: boolean;
  /** Shows the mixed selection state. */
  indeterminate?: boolean;
  /** Disables the row checkbox. */
  disabled?: boolean;
  /** Accessible name for the row checkbox. */
  label?: string;
}

export interface TableResizeHandleProps
  extends /* @vue-ignore */ ButtonHTMLAttributes {
  /** Accessible name for the resize control. */
  label?: string;
}

export interface TablePartSlots {
  default?: () => VNodeChild;
}

export type TableRootSlots = TablePartSlots;
export type TableSlots = TableRootSlots;
export type TableCaptionSlots = TablePartSlots;
export type TableHeaderSlots = TablePartSlots;
export type TableBodySlots = TablePartSlots;
export type TableRowSlots = TablePartSlots;
export type TableHeadSlots = TablePartSlots;
export type TableCellSlots = TablePartSlots;
export type TableFooterSlots = TablePartSlots;
export type TableCheckHeadSlots = TablePartSlots;
export type TableCheckCellSlots = TablePartSlots;
export type TableResizeHandleSlots = TablePartSlots;

export type TableCheckboxEmits = {
  checkedChange: [details: TableCheckboxChangeDetails];
  valueChange: [checked: boolean];
  "update:checked": [checked: boolean];
};

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isTableLayout = (value: unknown): value is TableLayout =>
  includes(TABLE_LAYOUTS, value);

export const isTableRowVariant = (value: unknown): value is TableRowVariant =>
  includes(TABLE_ROW_VARIANTS, value);

export const isTableStickyColumn = (value: unknown): value is TableStickyColumn =>
  includes(TABLE_STICKY_COLUMNS, value);

export const isTableHeaderVariant = (value: unknown): value is TableHeaderVariant =>
  includes(TABLE_HEADER_VARIANTS, value);

export const resolveTableLayout = (value: unknown): TableLayout =>
  isTableLayout(value) ? value : TABLE_DEFAULT_VARIANTS.layout;

export const resolveTableRowVariant = (value: unknown): TableRowVariant =>
  isTableRowVariant(value) ? value : TABLE_DEFAULT_VARIANTS.variant;

export const resolveTableStickyColumn = (
  value: unknown,
): TableStickyColumn | undefined => (isTableStickyColumn(value) ? value : undefined);

export const resolveTableHeaderVariant = (value: unknown): TableHeaderVariant =>
  isTableHeaderVariant(value) ? value : TABLE_DEFAULT_HEADER_VARIANT;
