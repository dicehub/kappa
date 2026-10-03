import type { HTMLAttributes, VNodeChild } from "vue";

export const PROPERTY_LIST_SIZES = ["sm", "base"] as const;
export const PROPERTY_LIST_LAYOUTS = ["horizontal", "stacked"] as const;
export type PropertyListSize = (typeof PROPERTY_LIST_SIZES)[number];
export type PropertyListLayout = (typeof PROPERTY_LIST_LAYOUTS)[number];

export interface PropertyListProps extends /* @vue-ignore */ HTMLAttributes {
  /** Row spacing and text size. */
  size?: PropertyListSize;
  /** Horizontal rows stack automatically in narrow containers. */
  layout?: PropertyListLayout;
  /** Add separators between rows. */
  divided?: boolean;
}
export interface PropertyListItemProps extends /* @vue-ignore */ HTMLAttributes {
  /** When present, renders a term and wraps the default slot in a value. */
  label?: string;
}
export interface PropertyListSlots { default?: () => VNodeChild }
export interface PropertyListItemSlots {
  default?: () => VNodeChild;
  label?: () => VNodeChild;
}
