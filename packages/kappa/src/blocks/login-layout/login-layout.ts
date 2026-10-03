import type { VNodeChild } from "vue";

export const LOGIN_LAYOUT_VARIANTS = ["centered", "split", "panel", "card"] as const;
export const LOGIN_LAYOUT_MEDIA_SIDES = ["start", "end"] as const;

export type LoginLayoutVariant = (typeof LOGIN_LAYOUT_VARIANTS)[number];
export type LoginLayoutMediaSide = (typeof LOGIN_LAYOUT_MEDIA_SIDES)[number];

export const LOGIN_LAYOUT_DEFAULTS = {
  label: "Sign in",
  mediaSide: "end",
  variant: "centered",
} as const satisfies Required<LoginLayoutProps>;

export interface LoginLayoutProps {
  /** Accessible name for the layout region. */
  label?: string;
  /** Logical side of the optional media region on wide viewports. */
  mediaSide?: LoginLayoutMediaSide;
  /** Page structure and surface treatment. */
  variant?: LoginLayoutVariant;
}

export interface LoginLayoutSlots {
  /** Product or organization identity. */
  brand?: () => VNodeChild;
  /** Login form or authentication flow. */
  default?: () => VNodeChild;
  /** Supporting illustration, photograph, or product context. */
  media?: () => VNodeChild;
  /** Legal text or secondary account links. */
  footer?: () => VNodeChild;
}

export const isLoginLayoutVariant = (value: unknown): value is LoginLayoutVariant =>
  typeof value === "string" && LOGIN_LAYOUT_VARIANTS.includes(value as LoginLayoutVariant);

export const resolveLoginLayoutVariant = (value: unknown): LoginLayoutVariant =>
  isLoginLayoutVariant(value) ? value : LOGIN_LAYOUT_DEFAULTS.variant;

export const isLoginLayoutMediaSide = (value: unknown): value is LoginLayoutMediaSide =>
  typeof value === "string" && LOGIN_LAYOUT_MEDIA_SIDES.includes(value as LoginLayoutMediaSide);

export const resolveLoginLayoutMediaSide = (value: unknown): LoginLayoutMediaSide =>
  isLoginLayoutMediaSide(value) ? value : LOGIN_LAYOUT_DEFAULTS.mediaSide;
