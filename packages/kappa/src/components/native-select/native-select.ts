import type {
  OptgroupHTMLAttributes,
  OptionHTMLAttributes,
  SelectHTMLAttributes,
  VNodeChild,
} from "vue";

export const NATIVE_SELECT_SIZES = ["xs", "sm", "base", "lg"] as const;
export const NATIVE_SELECT_DEFAULT_SIZE = "base" satisfies NativeSelectSize;

export type NativeSelectSize = (typeof NATIVE_SELECT_SIZES)[number];
export type NativeSelectValue = string | number;
export type NativeSelectModelValue =
  | NativeSelectValue
  | readonly NativeSelectValue[];

export interface NativeSelectProps
  extends /* @vue-ignore */ Omit<SelectHTMLAttributes, "size"> {
  /** Marks the control invalid and applies native aria-invalid semantics. */
  invalid?: boolean;
  /** Controlled value used by Vue v-model. Multiple selects use an array. */
  modelValue?: NativeSelectModelValue;
  /** Visual control height. This replaces the native visible-row size attribute. */
  size?: NativeSelectSize;
}

export type NativeSelectOptionProps = OptionHTMLAttributes;
export type NativeSelectOptGroupProps = OptgroupHTMLAttributes;

export interface NativeSelectSlots {
  default?: () => VNodeChild;
}

export type NativeSelectOptionSlots = NativeSelectSlots;
export type NativeSelectOptGroupSlots = NativeSelectSlots;

export type NativeSelectEmits = {
  "update:modelValue": [value: string | string[]];
};

export const isNativeSelectSize = (value: unknown): value is NativeSelectSize =>
  typeof value === "string" && NATIVE_SELECT_SIZES.includes(value as NativeSelectSize);

export const resolveNativeSelectSize = (value: unknown): NativeSelectSize =>
  isNativeSelectSize(value) ? value : NATIVE_SELECT_DEFAULT_SIZE;
