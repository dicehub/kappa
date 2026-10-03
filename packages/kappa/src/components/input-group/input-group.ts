import type {
  HTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  VNodeChild,
} from "vue";
import type { ButtonProps } from "../button/button";

export const INPUT_GROUP_SIZES = ["xs", "sm", "base", "lg"] as const;
export const INPUT_GROUP_ADDON_ALIGNS = [
  "inline-start",
  "inline-end",
  "block-start",
  "block-end",
] as const;

export const INPUT_GROUP_DEFAULT_SIZE = "base" satisfies InputGroupSize;
export const INPUT_GROUP_DEFAULT_ADDON_ALIGN =
  "inline-start" satisfies InputGroupAddonAlign;

export type InputGroupSize = (typeof INPUT_GROUP_SIZES)[number];
export type InputGroupAddonAlign = (typeof INPUT_GROUP_ADDON_ALIGNS)[number];
export type InputGroupModelValue = string | number;

export const isInputGroupSize = (value: unknown): value is InputGroupSize =>
  typeof value === "string" && INPUT_GROUP_SIZES.includes(value as InputGroupSize);

export const resolveInputGroupSize = (value: unknown): InputGroupSize =>
  isInputGroupSize(value) ? value : INPUT_GROUP_DEFAULT_SIZE;

export const isInputGroupAddonAlign = (
  value: unknown,
): value is InputGroupAddonAlign =>
  typeof value === "string" &&
  INPUT_GROUP_ADDON_ALIGNS.includes(value as InputGroupAddonAlign);

export const resolveInputGroupAddonAlign = (
  value: unknown,
): InputGroupAddonAlign =>
  isInputGroupAddonAlign(value)
    ? value
    : INPUT_GROUP_DEFAULT_ADDON_ALIGN;

export const isInputGroupInvalid = (attrs: Record<string, unknown>): boolean =>
  attrs["aria-invalid"] === true ||
  attrs["aria-invalid"] === "true" ||
  (attrs["data-invalid"] !== undefined && attrs["data-invalid"] !== false);

export const resolveInputGroupAriaBoolean = (
  value: unknown,
): "true" | "false" | undefined => {
  if (value === true || value === "true") return "true";
  if (value === false || value === "false") return "false";
  return undefined;
};

export interface InputGroupProps
  extends /* @vue-ignore */ Omit<HTMLAttributes, "role"> {
  /** Marks every control in the group as unavailable. */
  disabled?: boolean;
  /** Marks the group and its controls invalid. */
  invalid?: boolean;
  /** Shared control density. Individual parts can override it. */
  size?: InputGroupSize;
}

export type InputGroupRootProps = InputGroupProps;

export interface InputGroupAddonProps
  extends /* @vue-ignore */ Omit<HTMLAttributes, "align"> {
  /** Logical placement. Keep the addon after the control in DOM order. */
  align?: InputGroupAddonAlign;
}

export interface InputGroupInputProps
  extends /* @vue-ignore */ Omit<
    InputHTMLAttributes,
    "disabled" | "size"
  > {
  /** Initial native value for uncontrolled use. */
  defaultValue?: InputGroupModelValue;
  /** Disables this control in addition to the group state. */
  disabled?: boolean;
  /** Marks this control invalid in addition to the group state. */
  invalid?: boolean;
  /** Controlled value used by Vue v-model. Updates emit strings. */
  modelValue?: InputGroupModelValue;
  /** Visual control density. Defaults to the parent group size. */
  size?: InputGroupSize;
}

export interface InputGroupTextareaProps
  extends /* @vue-ignore */ Omit<TextareaHTMLAttributes, "disabled"> {
  /** Initial native value for uncontrolled use. */
  defaultValue?: InputGroupModelValue;
  /** Disables this control in addition to the group state. */
  disabled?: boolean;
  /** Marks this control invalid in addition to the group state. */
  invalid?: boolean;
  /** Controlled value used by Vue v-model. Updates emit strings. */
  modelValue?: InputGroupModelValue;
  /** Visual control density. Defaults to the parent group size. */
  size?: InputGroupSize;
}

export interface InputGroupButtonProps extends Omit<ButtonProps, "size"> {
  /** Visual control density. Defaults to the parent group size. */
  size?: InputGroupSize;
}

export interface InputGroupTextProps extends /* @vue-ignore */ HTMLAttributes {}

export interface InputGroupSlots {
  default?: () => VNodeChild;
}

export type InputGroupRootSlots = InputGroupSlots;
export type InputGroupAddonSlots = InputGroupSlots;
export type InputGroupButtonSlots = InputGroupSlots;
export type InputGroupTextSlots = InputGroupSlots;

export type InputGroupControlEmits = {
  "update:modelValue": [value: string];
  valueChange: [value: string];
};

export interface InputGroupContextValue {
  size: import("vue").ComputedRef<InputGroupSize>;
  disabled: import("vue").ComputedRef<boolean>;
  invalid: import("vue").ComputedRef<boolean>;
}
