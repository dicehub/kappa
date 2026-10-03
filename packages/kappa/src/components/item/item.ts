import type { AnchorHTMLAttributes, HTMLAttributes, VNodeChild } from "vue";

export const ITEM_VARIANTS = ["default", "outline", "muted"] as const;
export const ITEM_SIZES = ["default", "sm", "xs"] as const;
export const ITEM_MEDIA_VARIANTS = ["default", "icon", "image"] as const;
export const ITEM_ROOT_ELEMENTS = ["div", "article", "section", "li", "a"] as const;
export const ITEM_TITLE_ELEMENTS = ["h2", "h3", "h4", "h5", "h6", "p", "div"] as const;

export type ItemVariant = (typeof ITEM_VARIANTS)[number];
export type ItemSize = (typeof ITEM_SIZES)[number];
export type ItemMediaVariant = (typeof ITEM_MEDIA_VARIANTS)[number];
export type ItemRootElement = (typeof ITEM_ROOT_ELEMENTS)[number];
export type ItemTitleElement = (typeof ITEM_TITLE_ELEMENTS)[number];

export const ITEM_DEFAULT_VARIANT = "default" satisfies ItemVariant;
export const ITEM_DEFAULT_SIZE = "default" satisfies ItemSize;
export const ITEM_MEDIA_DEFAULT_VARIANT = "default" satisfies ItemMediaVariant;
export const ITEM_ROOT_DEFAULT_ELEMENT = "div" satisfies ItemRootElement;
export const ITEM_TITLE_DEFAULT_ELEMENT = "div" satisfies ItemTitleElement;

export interface ItemRootProps
  extends /* @vue-ignore */ Omit<AnchorHTMLAttributes, "size"> {
  /** Native element rendered by the item surface. */
  as?: ItemRootElement;
  /** Controls item density. */
  size?: ItemSize;
  /** Controls the item surface treatment. */
  variant?: ItemVariant;
}

export type ItemProps = ItemRootProps;

export interface ItemGroupProps extends /* @vue-ignore */ HTMLAttributes {}

export interface ItemSeparatorProps extends /* @vue-ignore */ HTMLAttributes {}

export interface ItemMediaProps extends /* @vue-ignore */ HTMLAttributes {
  /** Chooses the media container treatment. */
  variant?: ItemMediaVariant;
}

export interface ItemContentProps extends /* @vue-ignore */ HTMLAttributes {}

export interface ItemTitleProps extends /* @vue-ignore */ HTMLAttributes {
  /** Semantic element used for the item title. */
  as?: ItemTitleElement;
}

export interface ItemDescriptionProps extends /* @vue-ignore */ HTMLAttributes {}
export interface ItemActionsProps extends /* @vue-ignore */ HTMLAttributes {}
export interface ItemHeaderProps extends /* @vue-ignore */ HTMLAttributes {}
export interface ItemFooterProps extends /* @vue-ignore */ HTMLAttributes {}

export interface ItemPartSlots {
  default?: () => VNodeChild;
}

export type ItemRootSlots = ItemPartSlots;
export type ItemSlots = ItemRootSlots;
export type ItemGroupSlots = ItemPartSlots;
export type ItemMediaSlots = ItemPartSlots;
export type ItemContentSlots = ItemPartSlots;
export type ItemTitleSlots = ItemPartSlots;
export type ItemDescriptionSlots = ItemPartSlots;
export type ItemActionsSlots = ItemPartSlots;
export type ItemHeaderSlots = ItemPartSlots;
export type ItemFooterSlots = ItemPartSlots;

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isItemVariant = (value: unknown): value is ItemVariant =>
  includes(ITEM_VARIANTS, value);
export const isItemSize = (value: unknown): value is ItemSize =>
  includes(ITEM_SIZES, value);
export const isItemMediaVariant = (value: unknown): value is ItemMediaVariant =>
  includes(ITEM_MEDIA_VARIANTS, value);
export const isItemRootElement = (value: unknown): value is ItemRootElement =>
  includes(ITEM_ROOT_ELEMENTS, value);
export const isItemTitleElement = (value: unknown): value is ItemTitleElement =>
  includes(ITEM_TITLE_ELEMENTS, value);

export const resolveItemVariant = (value: unknown): ItemVariant =>
  isItemVariant(value) ? value : ITEM_DEFAULT_VARIANT;
export const resolveItemSize = (value: unknown): ItemSize =>
  isItemSize(value) ? value : ITEM_DEFAULT_SIZE;
export const resolveItemMediaVariant = (value: unknown): ItemMediaVariant =>
  isItemMediaVariant(value) ? value : ITEM_MEDIA_DEFAULT_VARIANT;
export const resolveItemRootElement = (value: unknown): ItemRootElement =>
  isItemRootElement(value) ? value : ITEM_ROOT_DEFAULT_ELEMENT;
export const resolveItemTitleElement = (value: unknown): ItemTitleElement =>
  isItemTitleElement(value) ? value : ITEM_TITLE_DEFAULT_ELEMENT;
