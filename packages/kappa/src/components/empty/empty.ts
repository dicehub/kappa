import type { VNodeChild } from "vue";

export const EMPTY_SIZES = ["sm", "base", "lg"] as const;
export const EMPTY_MEDIA_VARIANTS = ["default", "icon"] as const;
export const EMPTY_TITLE_ELEMENTS = ["h2", "h3", "h4", "p", "div"] as const;

export type EmptySize = (typeof EMPTY_SIZES)[number];
export type EmptyMediaVariant = (typeof EMPTY_MEDIA_VARIANTS)[number];
export type EmptyTitleElement = (typeof EMPTY_TITLE_ELEMENTS)[number];

export const EMPTY_DEFAULT_SIZE = "base" satisfies EmptySize;
export const EMPTY_MEDIA_DEFAULT_VARIANT = "default" satisfies EmptyMediaVariant;
export const EMPTY_TITLE_DEFAULT_ELEMENT = "h3" satisfies EmptyTitleElement;

export interface EmptyRootProps {
  /** Controls the spacing and type scale of the empty state. */
  size?: EmptySize;
}

export type EmptyProps = EmptyRootProps;

export interface EmptyMediaProps {
  /** Displays custom media as supplied or places an icon in a quiet container. */
  variant?: EmptyMediaVariant;
}

export interface EmptyTitleProps {
  /** Semantic element used for the title. */
  as?: EmptyTitleElement;
}

export interface EmptyRootSlots {
  default?: () => VNodeChild;
}

export type EmptySlots = EmptyRootSlots;

export interface EmptyHeaderSlots {
  default?: () => VNodeChild;
}

export interface EmptyMediaSlots {
  default?: () => VNodeChild;
}

export interface EmptyTitleSlots {
  default?: () => VNodeChild;
}

export interface EmptyDescriptionSlots {
  default?: () => VNodeChild;
}

export interface EmptyContentSlots {
  default?: () => VNodeChild;
}

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isEmptySize = (value: unknown): value is EmptySize =>
  includes(EMPTY_SIZES, value);

export const isEmptyMediaVariant = (value: unknown): value is EmptyMediaVariant =>
  includes(EMPTY_MEDIA_VARIANTS, value);

export const isEmptyTitleElement = (value: unknown): value is EmptyTitleElement =>
  includes(EMPTY_TITLE_ELEMENTS, value);

export const resolveEmptySize = (value: unknown): EmptySize =>
  isEmptySize(value) ? value : EMPTY_DEFAULT_SIZE;

export const resolveEmptyMediaVariant = (value: unknown): EmptyMediaVariant =>
  isEmptyMediaVariant(value) ? value : EMPTY_MEDIA_DEFAULT_VARIANT;

export const resolveEmptyTitleElement = (value: unknown): EmptyTitleElement =>
  isEmptyTitleElement(value) ? value : EMPTY_TITLE_DEFAULT_ELEMENT;
