import type { AnchorHTMLAttributes, HTMLAttributes, VNodeChild } from "vue";

export const CARD_SIZES = ["sm", "base"] as const;
export const CARD_ROOT_ELEMENTS = ["div", "article", "section", "aside", "a", "form"] as const;
export const CARD_HEADER_ELEMENTS = ["div", "header"] as const;
export const CARD_TITLE_ELEMENTS = ["h2", "h3", "h4", "h5", "h6", "p", "div"] as const;
export const CARD_DESCRIPTION_ELEMENTS = ["p", "div"] as const;
export const CARD_ACTION_ELEMENTS = ["div"] as const;
export const CARD_CONTENT_ELEMENTS = ["div", "section"] as const;
export const CARD_FOOTER_ELEMENTS = ["div", "footer"] as const;
export const CARD_PRIMARY_ELEMENTS = ["div", "article", "section", "a"] as const;
export const CARD_SECONDARY_ELEMENTS = ["div", "header", "p"] as const;

export type CardSize = (typeof CARD_SIZES)[number];
export type CardRootElement = (typeof CARD_ROOT_ELEMENTS)[number];
export type CardHeaderElement = (typeof CARD_HEADER_ELEMENTS)[number];
export type CardTitleElement = (typeof CARD_TITLE_ELEMENTS)[number];
export type CardDescriptionElement = (typeof CARD_DESCRIPTION_ELEMENTS)[number];
export type CardActionElement = (typeof CARD_ACTION_ELEMENTS)[number];
export type CardContentElement = (typeof CARD_CONTENT_ELEMENTS)[number];
export type CardFooterElement = (typeof CARD_FOOTER_ELEMENTS)[number];
export type CardPrimaryElement = (typeof CARD_PRIMARY_ELEMENTS)[number];
export type CardSecondaryElement = (typeof CARD_SECONDARY_ELEMENTS)[number];

export const CARD_DEFAULT_SIZE = "base" satisfies CardSize;
export const CARD_ROOT_DEFAULT_ELEMENT = "div" satisfies CardRootElement;
export const CARD_HEADER_DEFAULT_ELEMENT = "div" satisfies CardHeaderElement;
export const CARD_TITLE_DEFAULT_ELEMENT = "h3" satisfies CardTitleElement;
export const CARD_DESCRIPTION_DEFAULT_ELEMENT = "p" satisfies CardDescriptionElement;
export const CARD_ACTION_DEFAULT_ELEMENT = "div" satisfies CardActionElement;
export const CARD_CONTENT_DEFAULT_ELEMENT = "div" satisfies CardContentElement;
export const CARD_FOOTER_DEFAULT_ELEMENT = "div" satisfies CardFooterElement;
export const CARD_PRIMARY_DEFAULT_ELEMENT = "div" satisfies CardPrimaryElement;
export const CARD_SECONDARY_DEFAULT_ELEMENT = "div" satisfies CardSecondaryElement;

export interface CardRootProps extends /* @vue-ignore */ Omit<AnchorHTMLAttributes, "size"> {
  /** Native element rendered by the outer surface. */
  as?: CardRootElement;
  /** Controls the card spacing and type scale. */
  size?: CardSize;
}

export type CardProps = CardRootProps;

export interface CardHeaderProps extends /* @vue-ignore */ HTMLAttributes {
  as?: CardHeaderElement;
}

export interface CardTitleProps extends /* @vue-ignore */ HTMLAttributes {
  as?: CardTitleElement;
}

export interface CardDescriptionProps extends /* @vue-ignore */ HTMLAttributes {
  as?: CardDescriptionElement;
}

export interface CardActionProps extends /* @vue-ignore */ HTMLAttributes {
  as?: CardActionElement;
}

export interface CardContentProps extends /* @vue-ignore */ HTMLAttributes {
  as?: CardContentElement;
}

export interface CardFooterProps extends /* @vue-ignore */ HTMLAttributes {
  as?: CardFooterElement;
}

export interface CardPrimaryProps extends /* @vue-ignore */ AnchorHTMLAttributes {
  as?: CardPrimaryElement;
}

export interface CardSecondaryProps extends /* @vue-ignore */ HTMLAttributes {
  as?: CardSecondaryElement;
}

export interface CardPartSlots {
  default?: () => VNodeChild;
}

export type CardRootSlots = CardPartSlots;
export type CardSlots = CardRootSlots;
export type CardHeaderSlots = CardPartSlots;
export type CardTitleSlots = CardPartSlots;
export type CardDescriptionSlots = CardPartSlots;
export type CardActionSlots = CardPartSlots;
export type CardContentSlots = CardPartSlots;
export type CardFooterSlots = CardPartSlots;
export type CardPrimarySlots = CardPartSlots;
export type CardSecondarySlots = CardPartSlots;

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isCardSize = (value: unknown): value is CardSize => includes(CARD_SIZES, value);
export const isCardRootElement = (value: unknown): value is CardRootElement =>
  includes(CARD_ROOT_ELEMENTS, value);
export const isCardHeaderElement = (value: unknown): value is CardHeaderElement =>
  includes(CARD_HEADER_ELEMENTS, value);
export const isCardTitleElement = (value: unknown): value is CardTitleElement =>
  includes(CARD_TITLE_ELEMENTS, value);
export const isCardDescriptionElement = (value: unknown): value is CardDescriptionElement =>
  includes(CARD_DESCRIPTION_ELEMENTS, value);
export const isCardActionElement = (value: unknown): value is CardActionElement =>
  includes(CARD_ACTION_ELEMENTS, value);
export const isCardContentElement = (value: unknown): value is CardContentElement =>
  includes(CARD_CONTENT_ELEMENTS, value);
export const isCardFooterElement = (value: unknown): value is CardFooterElement =>
  includes(CARD_FOOTER_ELEMENTS, value);
export const isCardPrimaryElement = (value: unknown): value is CardPrimaryElement =>
  includes(CARD_PRIMARY_ELEMENTS, value);
export const isCardSecondaryElement = (value: unknown): value is CardSecondaryElement =>
  includes(CARD_SECONDARY_ELEMENTS, value);

export const resolveCardSize = (value: unknown): CardSize =>
  isCardSize(value) ? value : CARD_DEFAULT_SIZE;
export const resolveCardRootElement = (value: unknown): CardRootElement =>
  isCardRootElement(value) ? value : CARD_ROOT_DEFAULT_ELEMENT;
export const resolveCardHeaderElement = (value: unknown): CardHeaderElement =>
  isCardHeaderElement(value) ? value : CARD_HEADER_DEFAULT_ELEMENT;
export const resolveCardTitleElement = (value: unknown): CardTitleElement =>
  isCardTitleElement(value) ? value : CARD_TITLE_DEFAULT_ELEMENT;
export const resolveCardDescriptionElement = (value: unknown): CardDescriptionElement =>
  isCardDescriptionElement(value) ? value : CARD_DESCRIPTION_DEFAULT_ELEMENT;
export const resolveCardActionElement = (value: unknown): CardActionElement =>
  isCardActionElement(value) ? value : CARD_ACTION_DEFAULT_ELEMENT;
export const resolveCardContentElement = (value: unknown): CardContentElement =>
  isCardContentElement(value) ? value : CARD_CONTENT_DEFAULT_ELEMENT;
export const resolveCardFooterElement = (value: unknown): CardFooterElement =>
  isCardFooterElement(value) ? value : CARD_FOOTER_DEFAULT_ELEMENT;
export const resolveCardPrimaryElement = (value: unknown): CardPrimaryElement =>
  isCardPrimaryElement(value) ? value : CARD_PRIMARY_DEFAULT_ELEMENT;
export const resolveCardSecondaryElement = (value: unknown): CardSecondaryElement =>
  isCardSecondaryElement(value) ? value : CARD_SECONDARY_DEFAULT_ELEMENT;
