import CheckboxRoot from "./Checkbox.vue";
import CheckboxContext from "./CheckboxContext.vue";
import CheckboxControl from "./CheckboxControl.vue";
import CheckboxGroup from "./CheckboxGroup.vue";
import CheckboxIndicator from "./CheckboxIndicator.vue";
import CheckboxLabel from "./CheckboxLabel.vue";
import CheckboxRootProvider from "./CheckboxRootProvider.vue";

export const Checkbox = Object.assign(CheckboxRoot, {
  Root: CheckboxRoot,
  RootProvider: CheckboxRootProvider,
  Group: CheckboxGroup,
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Context: CheckboxContext,
});

export {
  CheckboxContext,
  CheckboxControl,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  CheckboxRootProvider,
};

export type {
  CheckboxApi,
  CheckboxCheckedChangeDetails,
  CheckboxCheckedState,
  CheckboxContextSlots,
  CheckboxContextValue,
  CheckboxControlProps,
  CheckboxControlSlots,
  CheckboxEmits,
  CheckboxGroupEmits,
  CheckboxGroupProps,
  CheckboxGroupSlots,
  CheckboxIndicatorProps,
  CheckboxIndicatorSlots,
  CheckboxLabelProps,
  CheckboxLabelSlots,
  CheckboxPartProps,
  CheckboxProps,
  CheckboxRootProps,
  CheckboxRootProviderProps,
  CheckboxRootProviderSlots,
  CheckboxRootSlots,
  CheckboxSlots,
} from "./checkbox";

export {
  checkboxAnatomy,
  useCheckbox,
  useCheckboxContext,
  useCheckboxGroup,
  useCheckboxGroupContext,
  type UseCheckboxGroupProps,
  type UseCheckboxGroupReturn,
  type UseCheckboxProps,
  type UseCheckboxReturn,
} from "@ark-ui/vue/checkbox";
