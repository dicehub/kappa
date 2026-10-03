import type {
  CheckboxCheckedChangeDetails,
  CheckboxCheckedState,
  CheckboxGroupProps as ArkCheckboxGroupProps,
  CheckboxRootProps as ArkCheckboxRootProps,
  UseCheckboxContext,
  UseCheckboxReturn,
} from "@ark-ui/vue/checkbox";
import type { UnwrapRef, VNodeChild } from "vue";

export type { CheckboxCheckedChangeDetails, CheckboxCheckedState };

export type CheckboxContextValue = UnwrapRef<UseCheckboxContext>;
export type CheckboxApi = UnwrapRef<UseCheckboxReturn>;

// Vue passes a bare `checked`/`default-checked` attribute as an empty string when the
// prop union mixes boolean with string literals; normalize that form to `true`.
export const resolveCheckboxCheckedState = (
  value: CheckboxCheckedState | "" | undefined,
): CheckboxCheckedState | undefined => (value === "" ? true : value);

export interface CheckboxProps {
  asChild?: ArkCheckboxRootProps["asChild"];
  checked?: ArkCheckboxRootProps["checked"];
  defaultChecked?: ArkCheckboxRootProps["defaultChecked"];
  disabled?: ArkCheckboxRootProps["disabled"];
  form?: ArkCheckboxRootProps["form"];
  id?: ArkCheckboxRootProps["id"];
  ids?: ArkCheckboxRootProps["ids"];
  invalid?: ArkCheckboxRootProps["invalid"];
  name?: ArkCheckboxRootProps["name"];
  readOnly?: ArkCheckboxRootProps["readOnly"];
  required?: ArkCheckboxRootProps["required"];
  value?: ArkCheckboxRootProps["value"];
}

export type CheckboxRootProps = CheckboxProps;

export type CheckboxEmits = {
  checkedChange: [details: CheckboxCheckedChangeDetails];
  "update:checked": [checked: CheckboxCheckedState];
};

export interface CheckboxSlots {
  default?: () => VNodeChild;
}

export type CheckboxRootSlots = CheckboxSlots;

export interface CheckboxRootProviderProps {
  value: CheckboxApi;
  asChild?: boolean;
}

export interface CheckboxRootProviderSlots {
  default?: () => VNodeChild;
}

export interface CheckboxGroupProps {
  asChild?: ArkCheckboxGroupProps["asChild"];
  defaultValue?: ArkCheckboxGroupProps["defaultValue"];
  disabled?: ArkCheckboxGroupProps["disabled"];
  invalid?: ArkCheckboxGroupProps["invalid"];
  maxSelectedValues?: ArkCheckboxGroupProps["maxSelectedValues"];
  modelValue?: ArkCheckboxGroupProps["modelValue"];
  name?: ArkCheckboxGroupProps["name"];
  readOnly?: ArkCheckboxGroupProps["readOnly"];
}

export type CheckboxGroupEmits = {
  valueChange: [value: string[]];
  "update:modelValue": [value: string[]];
};

export interface CheckboxGroupSlots {
  default?: () => VNodeChild;
}

export interface CheckboxPartProps {
  asChild?: boolean;
}

export type CheckboxControlProps = CheckboxPartProps;
export type CheckboxLabelProps = CheckboxPartProps;

export interface CheckboxIndicatorProps extends CheckboxPartProps {
  indeterminate?: boolean;
}

export interface CheckboxControlSlots {
  default?: () => VNodeChild;
}

export interface CheckboxIndicatorSlots {
  default?: () => VNodeChild;
}

export interface CheckboxLabelSlots {
  default?: () => VNodeChild;
}

export interface CheckboxContextSlots {
  default?: (context: CheckboxContextValue) => VNodeChild;
}
