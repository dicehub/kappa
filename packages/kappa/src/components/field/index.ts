import FieldRoot from "./Field.vue";
import FieldContext from "./FieldContext.vue";
import FieldErrorText from "./FieldErrorText.vue";
import FieldHelperText from "./FieldHelperText.vue";
import FieldInput from "./FieldInput.vue";
import FieldItem from "./FieldItem.vue";
import FieldLabel from "./FieldLabel.vue";
import FieldRequiredIndicator from "./FieldRequiredIndicator.vue";
import FieldRootProvider from "./FieldRootProvider.vue";
import FieldSelect from "./FieldSelect.vue";
import FieldTextarea from "./FieldTextarea.vue";

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  RootProvider: FieldRootProvider,
  Label: FieldLabel,
  Input: FieldInput,
  Textarea: FieldTextarea,
  Select: FieldSelect,
  HelperText: FieldHelperText,
  ErrorText: FieldErrorText,
  RequiredIndicator: FieldRequiredIndicator,
  Item: FieldItem,
  Context: FieldContext,
});

export {
  FieldContext,
  FieldErrorText,
  FieldHelperText,
  FieldInput,
  FieldItem,
  FieldLabel,
  FieldRequiredIndicator,
  FieldRoot,
  FieldRootProvider,
  FieldSelect,
  FieldTextarea,
};

export type {
  FieldApi,
  FieldContextSlots,
  FieldContextValue,
  FieldControlEmits,
  FieldErrorTextProps,
  FieldErrorTextSlots,
  FieldHelperTextProps,
  FieldHelperTextSlots,
  FieldInputProps,
  FieldInputSlots,
  FieldItemProps,
  FieldItemSlots,
  FieldLabelProps,
  FieldLabelSlots,
  FieldOrientation,
  FieldProps,
  FieldRequiredIndicatorProps,
  FieldRequiredIndicatorSlots,
  FieldRootProps,
  FieldRootProviderProps,
  FieldRootProviderSlots,
  FieldRootSlots,
  FieldSelectProps,
  FieldSelectSlots,
  FieldSlots,
  FieldTextareaProps,
  FieldTextareaSlots,
} from "./field";

export {
  FIELD_DEFAULT_ORIENTATION,
  FIELD_ORIENTATIONS,
  isFieldOrientation,
  resolveFieldOrientation,
} from "./field";

export {
  fieldAnatomy,
  useField,
  useFieldContext,
  type UseFieldContext,
  type UseFieldProps,
  type UseFieldReturn,
} from "@ark-ui/vue/field";
