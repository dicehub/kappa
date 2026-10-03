export const BADGE_VARIANTS = {
  primary: "primary",
  secondary: "secondary",
  error: "error",
  warning: "warning",
  success: "success",
  destructive: "destructive",
  info: "info",
  beta: "beta",
  outline: "outline",
  red: "red",
  orange: "orange",
  green: "green",
  teal: "teal",
  "teal-subtle": "teal-subtle",
  blue: "blue",
  purple: "purple",
  neutral: "neutral",
} as const;

export type BadgeVariant = keyof typeof BADGE_VARIANTS;
export type BadgeElement = "span" | "a";

export type BadgeProps = {
  /** Native element rendered by the badge. Use `a` for linked metadata. */
  as?: BadgeElement;
  /** Visual intent or categorical color. */
  variant?: BadgeVariant;
};

export const BADGE_DEFAULT_VARIANT = "primary" satisfies BadgeVariant;
export const BADGE_DEFAULT_ELEMENT = "span" satisfies BadgeElement;

export const isBadgeVariant = (value: unknown): value is BadgeVariant =>
  typeof value === "string" && Object.hasOwn(BADGE_VARIANTS, value);

export const isBadgeElement = (value: unknown): value is BadgeElement =>
  value === "span" || value === "a";
