import type {
  NumberInputControlProps as ArkNumberInputControlProps,
  NumberInputDecrementTriggerProps as ArkNumberInputDecrementTriggerProps,
  NumberInputFocusChangeDetails,
  NumberInputIncrementTriggerProps as ArkNumberInputIncrementTriggerProps,
  NumberInputInputProps as ArkNumberInputInputProps,
  NumberInputLabelProps as ArkNumberInputLabelProps,
  NumberInputRootProps as ArkNumberInputRootProps,
  NumberInputScrubberProps as ArkNumberInputScrubberProps,
  NumberInputValueChangeDetails,
  NumberInputValueInvalidDetails,
  NumberInputValueTextProps as ArkNumberInputValueTextProps,
  UseNumberInputContext,
  UseNumberInputReturn,
} from "@ark-ui/vue/number-input";
import type { HTMLAttributes, UnwrapRef, VNodeChild } from "vue";

export const NUMBER_INPUT_SIZES = ["xs", "sm", "default", "lg"] as const;
export const NUMBER_INPUT_DEFAULT_SIZE = "default" as const;
export const NUMBER_INPUT_EDIT_ALIGNMENTS = ["start", "center"] as const;

export type NumberInputSize = (typeof NUMBER_INPUT_SIZES)[number];
export type NumberInputEditAlignment = (typeof NUMBER_INPUT_EDIT_ALIGNMENTS)[number];
/** Optional multipliers of Root.step for pointer scrubbing only. Priority: control, shift, alt. */
export interface NumberInputScrubSensitivity {
  control?: number;
  shift?: number;
  alt?: number;
}
export const NUMBER_INPUT_DEFAULT_EDIT_ALIGNMENT =
  "start" satisfies NumberInputEditAlignment;
export type NumberInputDirection = "ltr" | "rtl";
export type NumberInputValueCommitDetails = NumberInputValueChangeDetails;
export type NumberInputContextValue = UnwrapRef<UseNumberInputContext>;
export type NumberInputApi = UnwrapRef<UseNumberInputReturn>;

export const isNumberInputSize = (value: unknown): value is NumberInputSize =>
  typeof value === "string" && NUMBER_INPUT_SIZES.includes(value as NumberInputSize);

export const resolveNumberInputSize = (value: unknown): NumberInputSize =>
  isNumberInputSize(value) ? value : NUMBER_INPUT_DEFAULT_SIZE;

export const isNumberInputEditAlignment = (
  value: unknown,
): value is NumberInputEditAlignment =>
  typeof value === "string" &&
  NUMBER_INPUT_EDIT_ALIGNMENTS.includes(value as NumberInputEditAlignment);

export const resolveNumberInputEditAlignment = (
  value: unknown,
): NumberInputEditAlignment =>
  isNumberInputEditAlignment(value) ? value : NUMBER_INPUT_DEFAULT_EDIT_ALIGNMENT;

export interface NumberInputProps {
  allowMouseWheel?: ArkNumberInputRootProps["allowMouseWheel"];
  allowOverflow?: ArkNumberInputRootProps["allowOverflow"];
  asChild?: ArkNumberInputRootProps["asChild"];
  clampValueOnBlur?: ArkNumberInputRootProps["clampValueOnBlur"];
  defaultValue?: ArkNumberInputRootProps["defaultValue"];
  dir?: NumberInputDirection;
  disabled?: ArkNumberInputRootProps["disabled"];
  focusInputOnChange?: ArkNumberInputRootProps["focusInputOnChange"];
  form?: ArkNumberInputRootProps["form"];
  formatOptions?: ArkNumberInputRootProps["formatOptions"];
  id?: ArkNumberInputRootProps["id"];
  ids?: ArkNumberInputRootProps["ids"];
  inputMode?: ArkNumberInputRootProps["inputMode"];
  invalid?: ArkNumberInputRootProps["invalid"];
  largeStep?: ArkNumberInputRootProps["largeStep"];
  locale?: ArkNumberInputRootProps["locale"];
  max?: ArkNumberInputRootProps["max"];
  min?: ArkNumberInputRootProps["min"];
  modelValue?: ArkNumberInputRootProps["modelValue"];
  name?: ArkNumberInputRootProps["name"];
  pattern?: ArkNumberInputRootProps["pattern"];
  readOnly?: ArkNumberInputRootProps["readOnly"];
  required?: ArkNumberInputRootProps["required"];
  size?: NumberInputSize;
  smallStep?: ArkNumberInputRootProps["smallStep"];
  spinOnPress?: ArkNumberInputRootProps["spinOnPress"];
  step?: ArkNumberInputRootProps["step"];
  translations?: ArkNumberInputRootProps["translations"];
}

export type NumberInputRootProps = NumberInputProps;

export type NumberInputEmits = {
  focusChange: [details: NumberInputFocusChangeDetails];
  valueChange: [details: NumberInputValueChangeDetails];
  valueCommit: [details: NumberInputValueCommitDetails];
  valueInvalid: [details: NumberInputValueInvalidDetails];
  "update:modelValue": [value: string];
};

export interface NumberInputSlots {
  default?: () => VNodeChild;
}

export type NumberInputRootSlots = NumberInputSlots;

export interface NumberInputRootProviderProps {
  value: NumberInputApi;
  allowMouseWheel?: boolean;
  asChild?: boolean;
  largeStep?: number;
  size?: NumberInputSize;
  smallStep?: number;
  step?: number;
}

export interface NumberInputRootProviderSlots {
  default?: () => VNodeChild;
}

export interface NumberInputPartProps {
  asChild?: boolean;
}

export type NumberInputLabelProps = ArkNumberInputLabelProps;
export type NumberInputControlProps = ArkNumberInputControlProps;
export type NumberInputInputProps = ArkNumberInputInputProps;
export type NumberInputScrubbableInputProps = Omit<ArkNumberInputInputProps, "asChild"> & {
  dragThreshold?: number;
  editAlignment?: NumberInputEditAlignment;
  scrubSensitivity?: NumberInputScrubSensitivity;
};
export type NumberInputValueTextProps = ArkNumberInputValueTextProps;
export type NumberInputIncrementTriggerProps = ArkNumberInputIncrementTriggerProps;
export type NumberInputDecrementTriggerProps = ArkNumberInputDecrementTriggerProps;
export type NumberInputScrubberProps = ArkNumberInputScrubberProps;
export type NumberInputUnitProps = HTMLAttributes;

export interface NumberInputPartSlots {
  default?: () => VNodeChild;
}

export type NumberInputLabelSlots = NumberInputPartSlots;
export type NumberInputControlSlots = NumberInputPartSlots;
export type NumberInputInputSlots = NumberInputPartSlots;
export interface NumberInputScrubbableInputSlots {
  default?: (props: {
    dragging: boolean;
    editing: boolean;
    value: string;
    valueAsNumber: number;
  }) => VNodeChild;
}
export type NumberInputIncrementTriggerSlots = NumberInputPartSlots;
export type NumberInputDecrementTriggerSlots = NumberInputPartSlots;
export type NumberInputScrubberSlots = NumberInputPartSlots;
export type NumberInputUnitSlots = NumberInputPartSlots;

export interface NumberInputValueTextSlots {
  default?: (props: { value: string; valueAsNumber: number }) => VNodeChild;
}

export interface NumberInputContextSlots {
  default?: (context: NumberInputContextValue) => VNodeChild;
}

export type {
  NumberInputFocusChangeDetails,
  NumberInputValueChangeDetails,
  NumberInputValueInvalidDetails,
  UseNumberInputContext,
  UseNumberInputReturn,
} from "@ark-ui/vue/number-input";
