import FieldsetRoot from "./Fieldset.vue";
import FieldsetContext from "./FieldsetContext.vue";
import FieldsetErrorText from "./FieldsetErrorText.vue";
import FieldsetHelperText from "./FieldsetHelperText.vue";
import FieldsetLegend from "./FieldsetLegend.vue";
import FieldsetRootProvider from "./FieldsetRootProvider.vue";

export const Fieldset = Object.assign(FieldsetRoot, {
  Root: FieldsetRoot,
  RootProvider: FieldsetRootProvider,
  Legend: FieldsetLegend,
  HelperText: FieldsetHelperText,
  ErrorText: FieldsetErrorText,
  Context: FieldsetContext,
});

export {
  FieldsetContext,
  FieldsetErrorText,
  FieldsetHelperText,
  FieldsetLegend,
  FieldsetRoot,
  FieldsetRootProvider,
};

export type {
  FieldsetApi,
  FieldsetContextSlots,
  FieldsetContextValue,
  FieldsetErrorTextProps,
  FieldsetErrorTextSlots,
  FieldsetHelperTextProps,
  FieldsetHelperTextSlots,
  FieldsetLegendProps,
  FieldsetLegendSlots,
  FieldsetOrientation,
  FieldsetProps,
  FieldsetRootProps,
  FieldsetRootProviderProps,
  FieldsetRootProviderSlots,
  FieldsetRootSlots,
  FieldsetSlots,
} from "./fieldset";

export {
  FIELDSET_DEFAULT_ORIENTATION,
  FIELDSET_ORIENTATIONS,
  isFieldsetOrientation,
  resolveFieldsetOrientation,
} from "./fieldset";

export {
  fieldsetAnatomy,
  useFieldset,
  useFieldsetContext,
  type UseFieldsetContext,
  type UseFieldsetProps,
  type UseFieldsetReturn,
} from "@ark-ui/vue/fieldset";
