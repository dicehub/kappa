import NumberInputRoot from "./NumberInput.vue";
import NumberInputContext from "./NumberInputContext.vue";
import NumberInputControl from "./NumberInputControl.vue";
import NumberInputDecrementTrigger from "./NumberInputDecrementTrigger.vue";
import NumberInputIncrementTrigger from "./NumberInputIncrementTrigger.vue";
import NumberInputInput from "./NumberInputInput.vue";
import NumberInputLabel from "./NumberInputLabel.vue";
import NumberInputRootProvider from "./NumberInputRootProvider.vue";
import NumberInputScrubber from "./NumberInputScrubber.vue";
import NumberInputScrubbableInput from "./NumberInputScrubbableInput.vue";
import NumberInputUnit from "./NumberInputUnit.vue";
import NumberInputValueText from "./NumberInputValueText.vue";

export const NumberInput = Object.assign(NumberInputRoot, {
  Root: NumberInputRoot,
  RootProvider: NumberInputRootProvider,
  Label: NumberInputLabel,
  Control: NumberInputControl,
  Input: NumberInputInput,
  ValueText: NumberInputValueText,
  IncrementTrigger: NumberInputIncrementTrigger,
  DecrementTrigger: NumberInputDecrementTrigger,
  Scrubber: NumberInputScrubber,
  ScrubbableInput: NumberInputScrubbableInput,
  Unit: NumberInputUnit,
  Context: NumberInputContext,
});

export {
  NumberInputContext,
  NumberInputControl,
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputInput,
  NumberInputLabel,
  NumberInputRoot,
  NumberInputRootProvider,
  NumberInputScrubber,
  NumberInputScrubbableInput,
  NumberInputUnit,
  NumberInputValueText,
};

export {
  NUMBER_INPUT_DEFAULT_EDIT_ALIGNMENT,
  NUMBER_INPUT_DEFAULT_SIZE,
  NUMBER_INPUT_EDIT_ALIGNMENTS,
  NUMBER_INPUT_SIZES,
  isNumberInputEditAlignment,
  isNumberInputSize,
  resolveNumberInputEditAlignment,
  resolveNumberInputSize,
  type NumberInputApi,
  type NumberInputContextSlots,
  type NumberInputContextValue,
  type NumberInputControlProps,
  type NumberInputControlSlots,
  type NumberInputDecrementTriggerProps,
  type NumberInputDecrementTriggerSlots,
  type NumberInputDirection,
  type NumberInputEditAlignment,
  type NumberInputEmits,
  type NumberInputFocusChangeDetails,
  type NumberInputIncrementTriggerProps,
  type NumberInputIncrementTriggerSlots,
  type NumberInputInputProps,
  type NumberInputInputSlots,
  type NumberInputLabelProps,
  type NumberInputLabelSlots,
  type NumberInputProps,
  type NumberInputRootProps,
  type NumberInputRootProviderProps,
  type NumberInputRootProviderSlots,
  type NumberInputRootSlots,
  type NumberInputScrubberProps,
  type NumberInputScrubberSlots,
  type NumberInputScrubSensitivity,
  type NumberInputScrubbableInputProps,
  type NumberInputScrubbableInputSlots,
  type NumberInputSize,
  type NumberInputSlots,
  type NumberInputUnitProps,
  type NumberInputUnitSlots,
  type NumberInputValueChangeDetails,
  type NumberInputValueCommitDetails,
  type NumberInputValueInvalidDetails,
  type NumberInputValueTextProps,
  type NumberInputValueTextSlots,
  type UseNumberInputContext,
  type UseNumberInputReturn,
} from "./number-input";

export {
  numberInputAnatomy,
  useNumberInputContext,
  type UseNumberInputProps,
} from "@ark-ui/vue/number-input";
export { useNumberInput } from "./use-number-input";
