import type {
  FieldErrorTextProps as ArkFieldErrorTextProps,
  FieldHelperTextProps as ArkFieldHelperTextProps,
  FieldInputProps as ArkFieldInputProps,
  FieldItemProps as ArkFieldItemProps,
  FieldLabelProps as ArkFieldLabelProps,
  FieldRequiredIndicatorProps as ArkFieldRequiredIndicatorProps,
  FieldRootProps as ArkFieldRootProps,
  FieldSelectProps as ArkFieldSelectProps,
  FieldTextareaProps as ArkFieldTextareaProps,
  UseFieldContext,
  UseFieldReturn,
} from "@ark-ui/vue/field";
import type { UnwrapRef, VNodeChild } from "vue";

export const FIELD_ORIENTATIONS = ["vertical", "horizontal", "responsive"] as const;
export const FIELD_DEFAULT_ORIENTATION = "vertical";

export type FieldOrientation = (typeof FIELD_ORIENTATIONS)[number];
export type FieldApi = UnwrapRef<UseFieldReturn>;
export type FieldContextValue = UnwrapRef<UseFieldContext>;

export interface FieldElementIds {
  root?: string;
  control?: string;
  label?: string;
  errorText?: string;
  helperText?: string;
}

export interface FieldProps {
  asChild?: ArkFieldRootProps["asChild"];
  disabled?: ArkFieldRootProps["disabled"];
  id?: ArkFieldRootProps["id"];
  ids?: FieldElementIds;
  invalid?: ArkFieldRootProps["invalid"];
  orientation?: FieldOrientation;
  readOnly?: ArkFieldRootProps["readOnly"];
  required?: ArkFieldRootProps["required"];
  target?: ArkFieldRootProps["target"];
}

export type FieldRootProps = FieldProps;

export interface FieldRootProviderProps {
  value: FieldApi;
  asChild?: boolean;
  orientation?: FieldOrientation;
}

export interface FieldSlots {
  default?: () => VNodeChild;
}

export type FieldRootSlots = FieldSlots;
export type FieldRootProviderSlots = FieldSlots;

export interface FieldControlPartProps {
  asChild?: boolean;
  modelValue?: string | number;
}

export interface FieldTextareaControlProps extends FieldControlPartProps {
  autoresize?: boolean;
}

export type FieldLabelProps = ArkFieldLabelProps;
export type FieldInputProps = ArkFieldInputProps;
export type FieldTextareaProps = ArkFieldTextareaProps;
export type FieldSelectProps = ArkFieldSelectProps;
export type FieldHelperTextProps = ArkFieldHelperTextProps;
export type FieldErrorTextProps = ArkFieldErrorTextProps;
export type FieldRequiredIndicatorProps = ArkFieldRequiredIndicatorProps;
export type FieldItemProps = ArkFieldItemProps;

export interface FieldPartSlots {
  default?: () => VNodeChild;
}

export type FieldLabelSlots = FieldPartSlots;
export type FieldInputSlots = FieldPartSlots;
export type FieldTextareaSlots = FieldPartSlots;
export type FieldSelectSlots = FieldPartSlots;
export type FieldHelperTextSlots = FieldPartSlots;
export type FieldErrorTextSlots = FieldPartSlots;
export type FieldItemSlots = FieldPartSlots;

export interface FieldRequiredIndicatorSlots extends FieldPartSlots {
  fallback?: () => VNodeChild;
}

export interface FieldContextSlots {
  default?: (context: FieldContextValue) => VNodeChild;
}

export type FieldControlEmits = {
  "update:modelValue": [value: string];
};

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isFieldOrientation = (value: unknown): value is FieldOrientation =>
  includes(FIELD_ORIENTATIONS, value);

export const resolveFieldOrientation = (value: unknown): FieldOrientation =>
  isFieldOrientation(value) ? value : FIELD_DEFAULT_ORIENTATION;
