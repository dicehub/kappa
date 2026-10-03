import type { ButtonHTMLAttributes, VNodeChild } from "vue";

export const TOGGLE_VARIANTS = ["default", "outline"] as const;
export const TOGGLE_SIZES = ["sm", "base", "lg"] as const;
export const TOGGLE_TYPES = ["button", "submit", "reset"] as const;

export type ToggleVariant = (typeof TOGGLE_VARIANTS)[number];
export type ToggleSize = (typeof TOGGLE_SIZES)[number];
export type ToggleType = (typeof TOGGLE_TYPES)[number];

export const TOGGLE_DEFAULT_VARIANT = "default" satisfies ToggleVariant;
export const TOGGLE_DEFAULT_SIZE = "base" satisfies ToggleSize;
export const TOGGLE_DEFAULT_TYPE = "button" satisfies ToggleType;

const includesOwn = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === "string" && values.includes(value as T);

export const isToggleVariant = (value: unknown): value is ToggleVariant =>
  includesOwn(TOGGLE_VARIANTS, value);

export const isToggleSize = (value: unknown): value is ToggleSize =>
  includesOwn(TOGGLE_SIZES, value);

export const isToggleType = (value: unknown): value is ToggleType =>
  includesOwn(TOGGLE_TYPES, value);

export const resolveToggleVariant = (value: unknown): ToggleVariant =>
  isToggleVariant(value) ? value : TOGGLE_DEFAULT_VARIANT;

export const resolveToggleSize = (value: unknown): ToggleSize =>
  isToggleSize(value) ? value : TOGGLE_DEFAULT_SIZE;

export const resolveToggleType = (value: unknown): ToggleType =>
  isToggleType(value) ? value : TOGGLE_DEFAULT_TYPE;

export interface ToggleProps
  extends /* @vue-ignore */ Omit<ButtonHTMLAttributes, "disabled" | "type"> {
  /** Controlled pressed state. Use with `v-model:pressed`. */
  pressed?: boolean;
  /** Initial pressed state when the component is uncontrolled. */
  defaultPressed?: boolean;
  disabled?: boolean;
  /** Quiet or bordered visual treatment. */
  variant?: ToggleVariant;
  /** Compact control height. */
  size?: ToggleSize;
  /** Native button type. Defaults to `button` to avoid accidental form submission. */
  type?: ToggleType;
}

export type ToggleEmits = {
  pressedChange: [pressed: boolean];
  "update:pressed": [pressed: boolean];
};

export interface ToggleSlots {
  default?: () => VNodeChild;
}
