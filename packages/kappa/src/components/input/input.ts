import type { InputHTMLAttributes } from "vue";

export const INPUT_SIZES = ["xs", "sm", "base", "lg"] as const;
export const INPUT_DEFAULT_SIZE = "base" satisfies InputSize;

export type InputSize = (typeof INPUT_SIZES)[number];
export type InputModelValue = string | number;

export interface InputProps
  extends /* @vue-ignore */ Omit<InputHTMLAttributes, "size"> {
  /** Marks the control invalid and applies native aria-invalid semantics. */
  invalid?: boolean;
  /** Controlled value used by Vue v-model. Native value remains available for uncontrolled use. */
  modelValue?: InputModelValue;
  /** Suppresses common password-manager overlays on non-credential fields. */
  passwordManagerIgnore?: boolean;
  /** Visual control height. This replaces the native character-count size attribute. */
  size?: InputSize;
}

export type InputEmits = {
  "update:modelValue": [value: string];
};

export const isInputSize = (value: unknown): value is InputSize =>
  typeof value === "string" && INPUT_SIZES.includes(value as InputSize);

export const resolveInputSize = (value: unknown): InputSize =>
  isInputSize(value) ? value : INPUT_DEFAULT_SIZE;
