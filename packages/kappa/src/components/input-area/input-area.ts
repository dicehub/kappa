import type { FieldTextareaProps as ArkFieldTextareaProps } from "@ark-ui/vue/field";
import type { VNodeChild } from "vue";
import type { InputSize } from "../input/input";

export const INPUT_AREA_SIZES = ["xs", "sm", "base", "lg"] as const;
export const INPUT_AREA_DEFAULT_SIZE = "base" satisfies InputAreaSize;

export type InputAreaSize = InputSize;
export type InputAreaModelValue = string | number;

export interface InputAreaProps
  extends /* @vue-ignore */ Omit<ArkFieldTextareaProps, "modelValue"> {
  /** Marks the control invalid and applies native aria-invalid semantics. */
  invalid?: boolean;
  /** Controlled value used by Vue v-model. Updates always emit strings. */
  modelValue?: InputAreaModelValue;
  /** Visual density for padding, radius, text, and minimum height. */
  size?: InputAreaSize;
}

export type InputAreaEmits = {
  "update:modelValue": [value: string];
};

export interface InputAreaSlots {
  default?: () => VNodeChild;
}

export const isInputAreaSize = (value: unknown): value is InputAreaSize =>
  typeof value === "string" && INPUT_AREA_SIZES.includes(value as InputAreaSize);
export const resolveInputAreaSize = (value: unknown): InputAreaSize =>
  isInputAreaSize(value) ? value : INPUT_AREA_DEFAULT_SIZE;
