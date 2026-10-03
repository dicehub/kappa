import type {
  PinInputControlProps as ArkPinInputControlProps,
  PinInputHiddenInputProps as ArkPinInputHiddenInputProps,
  PinInputInputProps as ArkPinInputInputProps,
  PinInputLabelProps as ArkPinInputLabelProps,
  PinInputRootProps as ArkPinInputRootProps,
  PinInputRootProviderProps as ArkPinInputRootProviderProps,
  PinInputValueChangeDetails,
  PinInputValueInvalidDetails,
  UsePinInputContext,
  UsePinInputReturn,
} from "@ark-ui/vue/pin-input";
import type { UnwrapRef, VNodeChild } from "vue";

export const INPUT_OTP_SIZES = ["sm", "base", "lg"] as const;
export const INPUT_OTP_DEFAULT_SIZE = "base" satisfies InputOtpSize;

export type InputOtpSize = (typeof INPUT_OTP_SIZES)[number];
export type InputOtpValueChangeDetails = PinInputValueChangeDetails;
export type InputOtpValueInvalidDetails = PinInputValueInvalidDetails;
export type InputOtpApi = UnwrapRef<UsePinInputReturn>;
export type InputOtpContextValue = UnwrapRef<UsePinInputContext>;

export interface InputOtpProps {
  asChild?: ArkPinInputRootProps["asChild"];
  autoFocus?: ArkPinInputRootProps["autoFocus"];
  autoSubmit?: ArkPinInputRootProps["autoSubmit"];
  blurOnComplete?: ArkPinInputRootProps["blurOnComplete"];
  count?: ArkPinInputRootProps["count"];
  defaultValue?: ArkPinInputRootProps["defaultValue"];
  disabled?: ArkPinInputRootProps["disabled"];
  form?: ArkPinInputRootProps["form"];
  id?: ArkPinInputRootProps["id"];
  ids?: ArkPinInputRootProps["ids"];
  invalid?: ArkPinInputRootProps["invalid"];
  mask?: ArkPinInputRootProps["mask"];
  modelValue?: ArkPinInputRootProps["modelValue"];
  name?: ArkPinInputRootProps["name"];
  otp?: ArkPinInputRootProps["otp"];
  pattern?: ArkPinInputRootProps["pattern"];
  placeholder?: ArkPinInputRootProps["placeholder"];
  readOnly?: ArkPinInputRootProps["readOnly"];
  required?: ArkPinInputRootProps["required"];
  sanitizeValue?: ArkPinInputRootProps["sanitizeValue"];
  selectOnFocus?: ArkPinInputRootProps["selectOnFocus"];
  translations?: ArkPinInputRootProps["translations"];
  type?: ArkPinInputRootProps["type"];
  /** Visual density for each pin cell. */
  size?: InputOtpSize;
}

export type InputOtpRootProps = InputOtpProps;

export type InputOtpEmits = {
  valueChange: [details: InputOtpValueChangeDetails];
  valueComplete: [details: InputOtpValueChangeDetails];
  valueInvalid: [details: InputOtpValueInvalidDetails];
  "update:modelValue": [value: string[]];
};

export interface InputOtpSlots {
  default?: () => VNodeChild;
}

export type InputOtpRootSlots = InputOtpSlots;
export type InputOtpRootProviderProps = Omit<
  ArkPinInputRootProviderProps,
  "value"
> & {
  value: InputOtpApi;
  size?: InputOtpSize;
};
export type InputOtpRootProviderSlots = InputOtpSlots;
export type InputOtpControlProps = ArkPinInputControlProps;
export type InputOtpControlSlots = InputOtpSlots;
export type InputOtpInputProps = ArkPinInputInputProps;
export type InputOtpInputSlots = InputOtpSlots;
export type InputOtpHiddenInputProps = ArkPinInputHiddenInputProps;
export type InputOtpHiddenInputSlots = InputOtpSlots;
export type InputOtpLabelProps = ArkPinInputLabelProps;
export type InputOtpLabelSlots = InputOtpSlots;

export interface InputOtpContextSlots {
  default?: (context: InputOtpContextValue) => VNodeChild;
}

export const isInputOtpSize = (value: unknown): value is InputOtpSize =>
  typeof value === "string" && INPUT_OTP_SIZES.includes(value as InputOtpSize);

export const resolveInputOtpSize = (value: unknown): InputOtpSize =>
  isInputOtpSize(value) ? value : INPUT_OTP_DEFAULT_SIZE;

export type {
  PinInputValueChangeDetails,
  PinInputValueInvalidDetails,
  UsePinInputContext,
  UsePinInputReturn,
};
