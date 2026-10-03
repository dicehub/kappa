import type { AnchorHTMLAttributes, HTMLAttributes, VNodeChild } from "vue";

export const LAYER_CARD_ROOT_ELEMENTS = ["div", "article", "section", "aside", "a", "form"] as const;
export const LAYER_CARD_PRIMARY_ELEMENTS = ["div", "article", "section", "a"] as const;
export const LAYER_CARD_SECONDARY_ELEMENTS = ["div", "header", "p"] as const;

export type LayerCardRootElement = (typeof LAYER_CARD_ROOT_ELEMENTS)[number];
export type LayerCardPrimaryElement = (typeof LAYER_CARD_PRIMARY_ELEMENTS)[number];
export type LayerCardSecondaryElement = (typeof LAYER_CARD_SECONDARY_ELEMENTS)[number];

export const LAYER_CARD_ROOT_DEFAULT_ELEMENT = "div" satisfies LayerCardRootElement;
export const LAYER_CARD_PRIMARY_DEFAULT_ELEMENT = "div" satisfies LayerCardPrimaryElement;
export const LAYER_CARD_SECONDARY_DEFAULT_ELEMENT = "div" satisfies LayerCardSecondaryElement;

export interface LayerCardRootProps extends /* @vue-ignore */ AnchorHTMLAttributes {
  /** Native element rendered by the outer surface. */
  as?: LayerCardRootElement;
}

export type LayerCardProps = LayerCardRootProps;

export interface LayerCardPrimaryProps extends /* @vue-ignore */ AnchorHTMLAttributes {
  /** Native element rendered by the raised primary surface. */
  as?: LayerCardPrimaryElement;
}

export interface LayerCardSecondaryProps extends /* @vue-ignore */ HTMLAttributes {
  /** Native element rendered by the supporting secondary surface. */
  as?: LayerCardSecondaryElement;
}

export interface LayerCardPartSlots {
  default?: () => VNodeChild;
}

export type LayerCardRootSlots = LayerCardPartSlots;
export type LayerCardSlots = LayerCardRootSlots;
export type LayerCardPrimarySlots = LayerCardPartSlots;
export type LayerCardSecondarySlots = LayerCardPartSlots;

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isLayerCardRootElement = (value: unknown): value is LayerCardRootElement =>
  includes(LAYER_CARD_ROOT_ELEMENTS, value);
export const isLayerCardPrimaryElement = (value: unknown): value is LayerCardPrimaryElement =>
  includes(LAYER_CARD_PRIMARY_ELEMENTS, value);
export const isLayerCardSecondaryElement = (value: unknown): value is LayerCardSecondaryElement =>
  includes(LAYER_CARD_SECONDARY_ELEMENTS, value);

export const resolveLayerCardRootElement = (value: unknown): LayerCardRootElement =>
  isLayerCardRootElement(value) ? value : LAYER_CARD_ROOT_DEFAULT_ELEMENT;
export const resolveLayerCardPrimaryElement = (value: unknown): LayerCardPrimaryElement =>
  isLayerCardPrimaryElement(value) ? value : LAYER_CARD_PRIMARY_DEFAULT_ELEMENT;
export const resolveLayerCardSecondaryElement = (value: unknown): LayerCardSecondaryElement =>
  isLayerCardSecondaryElement(value) ? value : LAYER_CARD_SECONDARY_DEFAULT_ELEMENT;
