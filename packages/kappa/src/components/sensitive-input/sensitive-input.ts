import type { InputHTMLAttributes, VNodeChild } from "vue";

export const SENSITIVE_INPUT_SIZES = ["xs", "sm", "base", "lg"] as const;
export const SENSITIVE_INPUT_DEFAULT_SIZE = "base" satisfies SensitiveInputSize;

export type SensitiveInputSize = (typeof SENSITIVE_INPUT_SIZES)[number];
export type SensitiveInputModelValue = string | number;
export type SensitiveInputMode = "empty" | "masked" | "revealed";

export interface SensitiveInputProps
  extends /* @vue-ignore */ Omit<
    InputHTMLAttributes,
    "defaultValue" | "disabled" | "readonly" | "size" | "type"
  > {
  /** Marks the input invalid and applies native aria-invalid semantics. */
  invalid?: boolean;
  /** Controlled value used by Vue v-model. Updates emit strings. */
  modelValue?: SensitiveInputModelValue;
  /** Initial value for uncontrolled use. */
  defaultValue?: SensitiveInputModelValue;
  /** Optional visible label rendered with a native for/id relationship. */
  label?: string;
  /** Optional help text connected to the input with aria-describedby. */
  description?: string;
  /** Optional validation message connected to the input with aria-describedby. */
  error?: string;
  /** Disables editing and reveal/copy actions. */
  disabled?: boolean;
  /** Keeps the value non-editable while still allowing reveal and copy. */
  readOnly?: boolean;
  /** Visual control density. */
  size?: SensitiveInputSize;
}

export type SensitiveInputEmits = {
  "update:modelValue": [value: string];
  valueChange: [value: string];
  copy: [];
  visibilityChange: [revealed: boolean];
};

export interface SensitiveInputSlots {
  label?: () => VNodeChild;
  description?: () => VNodeChild;
  error?: () => VNodeChild;
}

export const isSensitiveInputSize = (
  value: unknown,
): value is SensitiveInputSize =>
  typeof value === "string" &&
  SENSITIVE_INPUT_SIZES.includes(value as SensitiveInputSize);

export const resolveSensitiveInputSize = (
  value: unknown,
): SensitiveInputSize =>
  isSensitiveInputSize(value) ? value : SENSITIVE_INPUT_DEFAULT_SIZE;
