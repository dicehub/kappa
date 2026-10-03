import type { VNodeChild } from "vue";

export const TEXT_HEADING_VARIANTS = ["heading", "heading1", "heading2", "heading3"] as const;
export const TEXT_DEPRECATED_HEADING_VARIANTS = ["heading1", "heading2", "heading3"] as const;
export const TEXT_COPY_VARIANTS = ["body", "secondary", "success", "error"] as const;
export const TEXT_MONOSPACE_VARIANTS = ["mono", "mono-secondary"] as const;
export const TEXT_VARIANTS = [
  ...TEXT_HEADING_VARIANTS,
  ...TEXT_COPY_VARIANTS,
  ...TEXT_MONOSPACE_VARIANTS,
] as const;
export const TEXT_SIZES = ["xs", "sm", "base", "lg"] as const;
export const TEXT_ELEMENTS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "label",
  "dt",
  "dd",
  "li",
  "figcaption",
  "legend",
  "pre",
  "code",
  "em",
  "strong",
  "small",
  "abbr",
  "time",
] as const;

export type TextHeadingVariant = (typeof TEXT_HEADING_VARIANTS)[number];
export type TextDeprecatedHeadingVariant = (typeof TEXT_DEPRECATED_HEADING_VARIANTS)[number];
export type TextCopyVariant = (typeof TEXT_COPY_VARIANTS)[number];
export type TextMonospaceVariant = (typeof TEXT_MONOSPACE_VARIANTS)[number];
export type TextVariant = (typeof TEXT_VARIANTS)[number];
export type TextSize = (typeof TEXT_SIZES)[number];
export type TextElement = (typeof TEXT_ELEMENTS)[number];

export type TextProps =
  | {
      /** Body, muted, or status text treatment. */
      variant?: TextCopyVariant;
      /** Copy size on Kappa's compact interface scale. */
      size?: TextSize;
      /** Uses the medium copy weight. */
      bold?: boolean;
      /** Clips one overflowing line with an ellipsis. */
      truncate?: boolean;
      /** Native element rendered by the component. */
      as?: TextElement;
    }
  | {
      /** Monospace text treatment. */
      variant: TextMonospaceVariant;
      /** Optically matched large monospace size. */
      size?: "lg";
      bold?: never;
      truncate?: boolean;
      as?: TextElement;
    }
  | {
      /** Current heading treatment. Visual style does not set document structure. */
      variant: "heading";
      /** Optional large heading size. */
      size?: "lg";
      bold?: never;
      truncate?: boolean;
      as?: TextElement;
    }
  | {
      /** @deprecated Use `heading` with an explicit `as` and optional size. */
      variant: TextDeprecatedHeadingVariant;
      size?: never;
      bold?: never;
      truncate?: boolean;
      /** Required semantic element for a deprecated numbered heading treatment. */
      as: TextElement;
    };

export interface TextSlots {
  default?: () => VNodeChild;
}

export type KappaTextVariantsProps = {
  variant?: TextVariant;
  size?: TextSize;
};

export const TEXT_DEFAULT_VARIANTS = {
  variant: "body",
  size: "base",
} as const;

export const KAPPA_TEXT_DEFAULT_VARIANTS = TEXT_DEFAULT_VARIANTS;

export const KAPPA_TEXT_VARIANTS = {
  variant: {
    heading: { classes: "kappa-text--heading", description: "Compact interface heading" },
    /** @deprecated Use `heading` with an explicit element and size. */
    heading1: { classes: "kappa-text--heading1", description: "Deprecated page heading" },
    /** @deprecated Use `heading` with an explicit element and size. */
    heading2: { classes: "kappa-text--heading2", description: "Deprecated section heading" },
    /** @deprecated Use `heading` with an explicit element and size. */
    heading3: { classes: "kappa-text--heading3", description: "Deprecated subsection heading" },
    body: { classes: "kappa-text--body", description: "Default body text" },
    secondary: { classes: "kappa-text--secondary", description: "Muted supporting text" },
    success: { classes: "kappa-text--success", description: "Success status text" },
    error: { classes: "kappa-text--error", description: "Error status text" },
    mono: { classes: "kappa-text--mono", description: "Monospace technical text" },
    "mono-secondary": {
      classes: "kappa-text--mono-secondary",
      description: "Muted monospace technical text",
    },
  },
  size: {
    xs: { classes: "kappa-text--size-xs", description: "Extra-small interface copy" },
    sm: { classes: "kappa-text--size-sm", description: "Small interface copy" },
    base: { classes: "kappa-text--size-base", description: "Default interface copy" },
    lg: { classes: "kappa-text--size-lg", description: "Large interface copy" },
  },
} as const;

export const KAPPA_TEXT_STYLING = {
  fontSizes: { xs: 12, sm: 13, base: 14, lg: 16, xl: 20, "2xl": 24, "3xl": 30 },
  fontWeights: { normal: 400, medium: 550, semibold: 650 },
  baseColor: "kappa-text--body",
  variantColors: {
    body: "kappa-text--body",
    secondary: "kappa-text--secondary",
    success: "kappa-text--success",
    error: "kappa-text--error",
    mono: "kappa-text--mono",
    "mono-secondary": "kappa-text--mono-secondary",
  },
  fontFamilies: { default: "sans-serif", mono: "monospace" },
} as const;

export const isTextVariant = (value: unknown): value is TextVariant =>
  typeof value === "string" && TEXT_VARIANTS.includes(value as TextVariant);

export const isTextSize = (value: unknown): value is TextSize =>
  typeof value === "string" && TEXT_SIZES.includes(value as TextSize);

export const isTextElement = (value: unknown): value is TextElement =>
  typeof value === "string" && TEXT_ELEMENTS.includes(value as TextElement);

export const isCopyTextVariant = (value: unknown): value is TextCopyVariant =>
  typeof value === "string" && TEXT_COPY_VARIANTS.includes(value as TextCopyVariant);

export const isMonospaceTextVariant = (value: unknown): value is TextMonospaceVariant =>
  typeof value === "string" && TEXT_MONOSPACE_VARIANTS.includes(value as TextMonospaceVariant);

export const isHeadingTextVariant = (value: unknown): value is TextHeadingVariant =>
  typeof value === "string" && TEXT_HEADING_VARIANTS.includes(value as TextHeadingVariant);

export const isDeprecatedHeadingTextVariant = (
  value: unknown,
): value is TextDeprecatedHeadingVariant =>
  typeof value === "string" &&
  TEXT_DEPRECATED_HEADING_VARIANTS.includes(value as TextDeprecatedHeadingVariant);

export const resolveTextVariant = (value: unknown): TextVariant =>
  isTextVariant(value) ? value : TEXT_DEFAULT_VARIANTS.variant;

export const resolveTextSize = (value: unknown): TextSize =>
  isTextSize(value) ? value : TEXT_DEFAULT_VARIANTS.size;

export const resolveTextElement = (value: unknown, variant: TextVariant): TextElement => {
  if (isTextElement(value)) return value;
  return isHeadingTextVariant(variant) || isMonospaceTextVariant(variant) ? "span" : "p";
};

export const resolveTextSizeClass = (variant: TextVariant, size: TextSize): string | undefined => {
  if (variant === "heading") {
    return size === "lg" ? KAPPA_TEXT_VARIANTS.size.lg.classes : undefined;
  }
  if (isDeprecatedHeadingTextVariant(variant)) return undefined;
  if (isMonospaceTextVariant(variant)) {
    return size === "lg"
      ? KAPPA_TEXT_VARIANTS.size.base.classes
      : KAPPA_TEXT_VARIANTS.size.sm.classes;
  }
  return KAPPA_TEXT_VARIANTS.size[size].classes;
};

export const textVariants = ({
  variant = TEXT_DEFAULT_VARIANTS.variant,
  size = TEXT_DEFAULT_VARIANTS.size,
}: KappaTextVariantsProps = {}): string => {
  const resolvedVariant = resolveTextVariant(variant);
  const resolvedSize = resolveTextSize(size);
  return [
    "kappa-text",
    KAPPA_TEXT_VARIANTS.variant[resolvedVariant].classes,
    resolveTextSizeClass(resolvedVariant, resolvedSize),
  ]
    .filter(Boolean)
    .join(" ");
};
