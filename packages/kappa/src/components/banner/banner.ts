import type { Component, VNodeChild } from "vue";

export const BANNER_VARIANTS = {
  default: "default",
  alert: "alert",
  error: "error",
  secondary: "secondary",
} as const;

export const BANNER_SIZES = {
  base: "base",
  sm: "sm",
} as const;

export const BANNER_ACTION_VARIANTS = ["primary", "secondary", "ghost"] as const;
export const BANNER_ACTION_TYPES = ["button", "submit", "reset"] as const;

export type BannerVariant = keyof typeof BANNER_VARIANTS;
export type BannerSize = keyof typeof BANNER_SIZES;
export type BannerActionVariant = (typeof BANNER_ACTION_VARIANTS)[number];
export type BannerActionType = (typeof BANNER_ACTION_TYPES)[number];
export type BannerActionSize = "xs" | "sm";

export const BANNER_DEFAULT_VARIANT = "default" satisfies BannerVariant;
export const BANNER_DEFAULT_SIZE = "base" satisfies BannerSize;
export const BANNER_ACTION_DEFAULT_VARIANT = "primary" satisfies BannerActionVariant;
export const BANNER_ACTION_DEFAULT_TYPE = "button" satisfies BannerActionType;
export const BANNER_ACTION_DEFAULT_SIZE = "sm" satisfies BannerActionSize;

export const BANNER_ACTION_SIZE_BY_BANNER = {
  base: "sm",
  sm: "xs",
} as const satisfies Record<BannerSize, BannerActionSize>;

export interface BannerProps {
  /** Secondary copy rendered beneath or beside the title. */
  description?: string;
  /** Decorative icon component rendered before the banner copy. */
  icon?: Component;
  /** Attributes and props forwarded to the icon component. */
  iconProps?: Record<string, unknown>;
  /** Density of the banner and its contextual actions. */
  size?: BannerSize;
  /** Fallback copy used when the default slot is empty. */
  text?: string;
  /** Primary banner copy. Supplying it enables the structured layout. */
  title?: string;
  /** Visual intent. Live-region semantics remain consumer-controlled. */
  variant?: BannerVariant;
}

export interface BannerSlots {
  default?: () => VNodeChild;
  action?: () => VNodeChild;
  description?: () => VNodeChild;
  icon?: () => VNodeChild;
}

export interface BannerActionProps {
  /** Prevents activation using native button semantics. */
  disabled?: boolean;
  /** Native button type. Defaults to `button` to avoid accidental form submission. */
  type?: BannerActionType;
  /** Visual hierarchy within the parent banner. */
  variant?: BannerActionVariant;
}

export interface BannerActionSlots {
  default?: () => VNodeChild;
}

export const isBannerVariant = (value: unknown): value is BannerVariant =>
  typeof value === "string" && Object.hasOwn(BANNER_VARIANTS, value);

export const isBannerSize = (value: unknown): value is BannerSize =>
  typeof value === "string" && Object.hasOwn(BANNER_SIZES, value);

export const isBannerActionVariant = (value: unknown): value is BannerActionVariant =>
  typeof value === "string" && BANNER_ACTION_VARIANTS.includes(value as BannerActionVariant);

export const isBannerActionType = (value: unknown): value is BannerActionType =>
  typeof value === "string" && BANNER_ACTION_TYPES.includes(value as BannerActionType);

export const resolveBannerVariant = (value: unknown): BannerVariant =>
  isBannerVariant(value) ? value : BANNER_DEFAULT_VARIANT;

export const resolveBannerSize = (value: unknown): BannerSize =>
  isBannerSize(value) ? value : BANNER_DEFAULT_SIZE;

export const resolveBannerActionVariant = (value: unknown): BannerActionVariant =>
  isBannerActionVariant(value) ? value : BANNER_ACTION_DEFAULT_VARIANT;

export const resolveBannerActionType = (value: unknown): BannerActionType =>
  isBannerActionType(value) ? value : BANNER_ACTION_DEFAULT_TYPE;
