import type { VNodeChild } from "vue";

export const LABEL_ELEMENTS = ["label", "span"] as const;

export type LabelElement = (typeof LABEL_ELEMENTS)[number];

export const LABEL_DEFAULT_ELEMENT = "label" satisfies LabelElement;
export const LABEL_DEFAULT_OPTIONAL_TEXT = "optional";

export interface LabelProps {
  /** Native element rendered by the component. */
  as?: LabelElement;
  /** Renders a span and inherits the surrounding typography for nested composition. */
  asContent?: boolean;
  /** Control id associated with a native label. Native `for` is also supported. */
  htmlFor?: string;
  /** Shows a quiet optional marker after the label text. */
  showOptional?: boolean;
  /** Translated text used by the optional marker. */
  optionalText?: string;
}

export interface LabelSlots {
  default?: () => VNodeChild;
}

export const isLabelElement = (value: unknown): value is LabelElement =>
  value === "label" || value === "span";

export const resolveLabelElement = (value: unknown, asContent = false): LabelElement =>
  asContent ? "span" : isLabelElement(value) ? value : LABEL_DEFAULT_ELEMENT;

export const resolveLabelOptionalText = (value: unknown): string =>
  typeof value === "string" && value.trim().length > 0
    ? value
    : LABEL_DEFAULT_OPTIONAL_TEXT;
