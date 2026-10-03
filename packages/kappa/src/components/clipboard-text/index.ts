import ClipboardTextRoot from "./ClipboardText.vue";
import ClipboardTextContext from "./ClipboardTextContext.vue";
import ClipboardTextControl from "./ClipboardTextControl.vue";
import ClipboardTextIndicator from "./ClipboardTextIndicator.vue";
import ClipboardTextInput from "./ClipboardTextInput.vue";
import ClipboardTextLabel from "./ClipboardTextLabel.vue";
import ClipboardTextRootProvider from "./ClipboardTextRootProvider.vue";
import ClipboardTextTrigger from "./ClipboardTextTrigger.vue";
import ClipboardTextValueText from "./ClipboardTextValueText.vue";

export const ClipboardText = Object.assign(ClipboardTextRoot, {
  Root: ClipboardTextRoot,
  RootProvider: ClipboardTextRootProvider,
  Label: ClipboardTextLabel,
  Control: ClipboardTextControl,
  Input: ClipboardTextInput,
  Trigger: ClipboardTextTrigger,
  Indicator: ClipboardTextIndicator,
  ValueText: ClipboardTextValueText,
  Context: ClipboardTextContext,
});

export {
  ClipboardTextContext,
  ClipboardTextControl,
  ClipboardTextIndicator,
  ClipboardTextInput,
  ClipboardTextLabel,
  ClipboardTextRoot,
  ClipboardTextRootProvider,
  ClipboardTextTrigger,
  ClipboardTextValueText,
};

export type {
  ClipboardCopyStatusDetails,
  ClipboardTextApi,
  ClipboardTextContextSlots,
  ClipboardTextContextValue,
  ClipboardTextControlProps,
  ClipboardTextControlSlots,
  ClipboardTextEmits,
  ClipboardTextIndicatorProps,
  ClipboardTextIndicatorSlots,
  ClipboardTextInputProps,
  ClipboardTextInputSlots,
  ClipboardTextLabelProps,
  ClipboardTextLabelSlots,
  ClipboardTextPartProps,
  ClipboardTextProps,
  ClipboardTextRootProps,
  ClipboardTextRootProviderProps,
  ClipboardTextRootProviderSlots,
  ClipboardTextRootSlots,
  ClipboardTextSlots,
  ClipboardTextTriggerProps,
  ClipboardTextTriggerSlots,
  ClipboardTextValueChangeDetails,
  ClipboardTextValueTextProps,
  ClipboardTextValueTextSlots,
} from "./clipboard-text";

export {
  clipboardAnatomy,
  useClipboard,
  useClipboardContext,
  type UseClipboardProps,
  type UseClipboardReturn,
} from "@ark-ui/vue/clipboard";
