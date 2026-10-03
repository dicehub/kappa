import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  Component,
  VNodeChild,
} from "vue";

export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "secondary-destructive",
  "destructive-outline",
  "success",
  "warning",
  "link",
] as const;

export const BUTTON_SIZES = ["xs", "sm", "base", "lg"] as const;
export const BUTTON_SHAPES = ["base", "square", "circle"] as const;
export const BUTTON_ICON_POSITIONS = ["inline-start", "inline-end"] as const;
export const BUTTON_TYPES = ["button", "submit", "reset"] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];
export type ButtonIconPosition = (typeof BUTTON_ICON_POSITIONS)[number];
export type ButtonType = (typeof BUTTON_TYPES)[number];

export const BUTTON_DEFAULT_VARIANT = "secondary" satisfies ButtonVariant;
export const BUTTON_DEFAULT_SIZE = "base" satisfies ButtonSize;
export const BUTTON_DEFAULT_SHAPE = "base" satisfies ButtonShape;
export const BUTTON_DEFAULT_ICON_POSITION =
  "inline-start" satisfies ButtonIconPosition;
export const BUTTON_DEFAULT_TYPE = "button" satisfies ButtonType;

const includesOwn = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === "string" && values.includes(value as T);

export const isButtonVariant = (value: unknown): value is ButtonVariant =>
  includesOwn(BUTTON_VARIANTS, value);
export const isButtonSize = (value: unknown): value is ButtonSize =>
  includesOwn(BUTTON_SIZES, value);
export const isButtonShape = (value: unknown): value is ButtonShape =>
  includesOwn(BUTTON_SHAPES, value);
export const isButtonIconPosition = (value: unknown): value is ButtonIconPosition =>
  includesOwn(BUTTON_ICON_POSITIONS, value);
export const isButtonType = (value: unknown): value is ButtonType =>
  includesOwn(BUTTON_TYPES, value);

export const resolveButtonVariant = (value: unknown): ButtonVariant =>
  isButtonVariant(value) ? value : BUTTON_DEFAULT_VARIANT;
export const resolveButtonSize = (value: unknown): ButtonSize =>
  isButtonSize(value) ? value : BUTTON_DEFAULT_SIZE;
export const resolveButtonShape = (value: unknown): ButtonShape =>
  isButtonShape(value) ? value : BUTTON_DEFAULT_SHAPE;
export const resolveButtonIconPosition = (value: unknown): ButtonIconPosition =>
  isButtonIconPosition(value) ? value : BUTTON_DEFAULT_ICON_POSITION;
export const resolveButtonType = (value: unknown): ButtonType =>
  isButtonType(value) ? value : BUTTON_DEFAULT_TYPE;

export interface ButtonVisualProps {
  /** Visual intent. Defaults to the quiet secondary treatment. */
  variant?: ButtonVariant;
  /** Compact control height: 24, 28, 32, or 36 pixels. */
  size?: ButtonSize;
  /** Base, square icon-only, or circular geometry. */
  shape?: ButtonShape;
  /** Optional icon component rendered beside the label. */
  icon?: Component;
  /** Attributes passed to the icon component. */
  iconProps?: Record<string, unknown>;
  /** Logical icon position, safe in left-to-right and right-to-left layouts. */
  iconPosition?: ButtonIconPosition;
  /** Fill the inline size of the containing block. */
  fullWidth?: boolean;
  /** Native advisory title. Icon-only controls still require an accessible name. */
  title?: string | number;
}

export interface ButtonProps
  extends ButtonVisualProps,
    /* @vue-ignore */ Omit<ButtonHTMLAttributes, "disabled" | "title" | "type"> {
  disabled?: boolean;
  /** Busy state. Disables activation while preserving the visible label. */
  loading?: boolean;
  type?: ButtonType;
}

export interface LinkButtonProps
  extends ButtonVisualProps,
    /* @vue-ignore */ Omit<AnchorHTMLAttributes, "href" | "title"> {
  href?: string;
  /** Open in a new context with safe rel defaults unless overridden. */
  external?: boolean;
  /** Renders a native disabled button instead of an unavailable link. */
  disabled?: boolean;
  /** Merge behavior and styling onto one child, e.g. RouterLink. The child owns icon markup. */
  asChild?: boolean;
}

export interface ButtonSlots {
  default?: () => VNodeChild;
}

export type LinkButtonSlots = ButtonSlots;
