import InputOtpRoot from "./InputOtp.vue";
import InputOtpContext from "./InputOtpContext.vue";
import InputOtpControl from "./InputOtpControl.vue";
import InputOtpHiddenInput from "./InputOtpHiddenInput.vue";
import InputOtpInput from "./InputOtpInput.vue";
import InputOtpLabel from "./InputOtpLabel.vue";
import InputOtpRootProvider from "./InputOtpRootProvider.vue";

export const InputOtp = Object.assign(InputOtpRoot, {
  Root: InputOtpRoot,
  RootProvider: InputOtpRootProvider,
  Control: InputOtpControl,
  Input: InputOtpInput,
  HiddenInput: InputOtpHiddenInput,
  Label: InputOtpLabel,
  Context: InputOtpContext,
});

export {
  InputOtpContext,
  InputOtpControl,
  InputOtpHiddenInput,
  InputOtpInput,
  InputOtpLabel,
  InputOtpRoot,
  InputOtpRootProvider,
};

export {
  INPUT_OTP_DEFAULT_SIZE,
  INPUT_OTP_SIZES,
  isInputOtpSize,
  resolveInputOtpSize,
  type InputOtpApi,
  type InputOtpContextSlots,
  type InputOtpContextValue,
  type InputOtpControlProps,
  type InputOtpControlSlots,
  type InputOtpEmits,
  type InputOtpHiddenInputProps,
  type InputOtpHiddenInputSlots,
  type InputOtpInputProps,
  type InputOtpInputSlots,
  type InputOtpLabelProps,
  type InputOtpLabelSlots,
  type InputOtpProps,
  type InputOtpRootProps,
  type InputOtpRootProviderProps,
  type InputOtpRootProviderSlots,
  type InputOtpRootSlots,
  type InputOtpSize,
  type InputOtpSlots,
  type InputOtpValueChangeDetails,
  type InputOtpValueInvalidDetails,
  type PinInputValueChangeDetails,
  type PinInputValueInvalidDetails,
  type UsePinInputContext,
  type UsePinInputReturn,
} from "./input-otp";

export {
  pinInputAnatomy,
  usePinInput,
  usePinInputContext,
  type UsePinInputProps,
} from "@ark-ui/vue/pin-input";
