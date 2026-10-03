import type {
  ClipboardCopyStatusDetails,
  ClipboardRootEmits as ArkClipboardRootEmits,
  ClipboardRootProps as ArkClipboardRootProps,
  UseClipboardContext,
  UseClipboardReturn,
} from "@ark-ui/vue/clipboard";
import type { UnwrapRef, VNodeChild } from "vue";

export type { ClipboardCopyStatusDetails } from "@ark-ui/vue/clipboard";

export type ClipboardTextValueChangeDetails =
  ArkClipboardRootEmits["valueChange"] extends [details: infer Details] ? Details : never;

export type ClipboardTextContextValue = UnwrapRef<UseClipboardContext>;
export type ClipboardTextApi = UnwrapRef<UseClipboardReturn>;

export interface ClipboardTextProps {
  asChild?: ArkClipboardRootProps["asChild"];
  defaultValue?: ArkClipboardRootProps["defaultValue"];
  id?: ArkClipboardRootProps["id"];
  ids?: ArkClipboardRootProps["ids"];
  modelValue?: ArkClipboardRootProps["modelValue"];
  timeout?: ArkClipboardRootProps["timeout"];
  translations?: ArkClipboardRootProps["translations"];
}

export type ClipboardTextRootProps = ClipboardTextProps;

export type ClipboardTextEmits = {
  statusChange: [details: ClipboardCopyStatusDetails];
  "update:modelValue": [value: string];
  valueChange: [details: ClipboardTextValueChangeDetails];
};

export interface ClipboardTextSlots {
  default?: () => VNodeChild;
}

export type ClipboardTextRootSlots = ClipboardTextSlots;

export interface ClipboardTextRootProviderProps {
  value: ClipboardTextApi;
  asChild?: boolean;
}

export interface ClipboardTextRootProviderSlots {
  default?: () => VNodeChild;
}

export interface ClipboardTextPartProps {
  asChild?: boolean;
}

export type ClipboardTextLabelProps = ClipboardTextPartProps;
export type ClipboardTextControlProps = ClipboardTextPartProps;
export type ClipboardTextInputProps = ClipboardTextPartProps;
export type ClipboardTextTriggerProps = ClipboardTextPartProps;
export type ClipboardTextIndicatorProps = ClipboardTextPartProps;
export type ClipboardTextValueTextProps = ClipboardTextPartProps;

export interface ClipboardTextLabelSlots {
  default?: () => VNodeChild;
}

export interface ClipboardTextControlSlots {
  default?: () => VNodeChild;
}

export interface ClipboardTextInputSlots {
  default?: () => VNodeChild;
}

export interface ClipboardTextTriggerSlots {
  default?: () => VNodeChild;
}

export interface ClipboardTextIndicatorSlots {
  default?: () => VNodeChild;
  copied?: () => VNodeChild;
}

export interface ClipboardTextValueTextSlots {
  default?: () => VNodeChild;
}

export interface ClipboardTextContextSlots {
  default?: (context: ClipboardTextContextValue) => VNodeChild;
}
