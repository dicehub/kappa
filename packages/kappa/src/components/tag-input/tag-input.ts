import type {
  TagsInputClearTriggerProps as ArkTagsInputClearTriggerProps,
  TagsInputControlProps as ArkTagsInputControlProps,
  TagsInputFocusOutsideEvent,
  TagsInputHiddenInputProps as ArkTagsInputHiddenInputProps,
  TagsInputHighlightChangeDetails,
  TagsInputInputProps as ArkTagsInputInputProps,
  TagsInputInputValueChangeDetails,
  TagsInputInteractOutsideEvent,
  TagsInputItemDeleteTriggerProps as ArkTagsInputItemDeleteTriggerProps,
  TagsInputItemInputProps as ArkTagsInputItemInputProps,
  TagsInputItemPreviewProps as ArkTagsInputItemPreviewProps,
  TagsInputItemProps as ArkTagsInputItemProps,
  TagsInputItemTextProps as ArkTagsInputItemTextProps,
  TagsInputLabelProps as ArkTagsInputLabelProps,
  TagsInputPointerDownOutsideEvent,
  TagsInputRootProps as ArkTagsInputRootProps,
  TagsInputRootProviderProps as ArkTagsInputRootProviderProps,
  TagsInputValidityChangeDetails,
  TagsInputValueChangeDetails,
  UseTagsInputContext,
  UseTagsInputItemContext,
  UseTagsInputReturn,
} from "@ark-ui/vue/tags-input";
import type { UnwrapRef, VNodeChild } from "vue";

export const TAG_INPUT_SIZES = ["xs", "sm", "base", "lg"] as const;
export const TAG_INPUT_DEFAULT_SIZE = "base" satisfies TagInputSize;

export type TagInputSize = (typeof TAG_INPUT_SIZES)[number];
export type TagInputValueChangeDetails = TagsInputValueChangeDetails;
export type TagInputValidityChangeDetails = TagsInputValidityChangeDetails;
export type TagInputHighlightChangeDetails = TagsInputHighlightChangeDetails;
export type TagInputInputValueChangeDetails = TagsInputInputValueChangeDetails;
export type TagInputApi = UnwrapRef<UseTagsInputReturn>;
export type TagInputContextValue = UnwrapRef<UseTagsInputContext>;
export type TagInputItemContextValue = UnwrapRef<UseTagsInputItemContext>;

export interface TagInputProps {
  asChild?: ArkTagsInputRootProps["asChild"];
  addOnPaste?: ArkTagsInputRootProps["addOnPaste"];
  allowDuplicates?: ArkTagsInputRootProps["allowDuplicates"];
  allowOverflow?: ArkTagsInputRootProps["allowOverflow"];
  autoFocus?: ArkTagsInputRootProps["autoFocus"];
  blurBehavior?: ArkTagsInputRootProps["blurBehavior"];
  defaultInputValue?: ArkTagsInputRootProps["defaultInputValue"];
  defaultValue?: ArkTagsInputRootProps["defaultValue"];
  delimiter?: ArkTagsInputRootProps["delimiter"];
  disabled?: ArkTagsInputRootProps["disabled"];
  editable?: ArkTagsInputRootProps["editable"];
  form?: ArkTagsInputRootProps["form"];
  id?: ArkTagsInputRootProps["id"];
  ids?: ArkTagsInputRootProps["ids"];
  inputValue?: ArkTagsInputRootProps["inputValue"];
  invalid?: ArkTagsInputRootProps["invalid"];
  max?: ArkTagsInputRootProps["max"];
  maxLength?: ArkTagsInputRootProps["maxLength"];
  modelValue?: ArkTagsInputRootProps["modelValue"];
  name?: ArkTagsInputRootProps["name"];
  placeholder?: ArkTagsInputRootProps["placeholder"];
  readOnly?: ArkTagsInputRootProps["readOnly"];
  required?: ArkTagsInputRootProps["required"];
  sanitizeValue?: ArkTagsInputRootProps["sanitizeValue"];
  /** Visual density for the control and its tags. */
  size?: TagInputSize;
  translations?: ArkTagsInputRootProps["translations"];
  validate?: ArkTagsInputRootProps["validate"];
}

export type TagInputRootProps = TagInputProps;

export type TagInputEmits = {
  focusOutside: [event: TagsInputFocusOutsideEvent];
  highlightChange: [details: TagInputHighlightChangeDetails];
  inputValueChange: [details: TagInputInputValueChangeDetails];
  interactOutside: [event: TagsInputInteractOutsideEvent];
  pointerDownOutside: [event: TagsInputPointerDownOutsideEvent];
  valueChange: [details: TagInputValueChangeDetails];
  valueInvalid: [details: TagInputValidityChangeDetails];
  "update:inputValue": [value: string];
  "update:modelValue": [value: string[]];
};

export interface TagInputSlots {
  default?: () => VNodeChild;
}

export type TagInputRootSlots = TagInputSlots;
export type TagInputRootProviderProps = Omit<
  ArkTagsInputRootProviderProps,
  "value"
> & {
  value: TagInputApi;
  size?: TagInputSize;
};
export type TagInputRootProviderSlots = TagInputSlots;
export type TagInputLabelProps = ArkTagsInputLabelProps;
export type TagInputLabelSlots = TagInputSlots;
export type TagInputControlProps = ArkTagsInputControlProps;
export type TagInputControlSlots = TagInputSlots;
export type TagInputItemProps = ArkTagsInputItemProps;
export type TagInputItemSlots = TagInputSlots;
export type TagInputItemPreviewProps = ArkTagsInputItemPreviewProps;
export type TagInputItemPreviewSlots = TagInputSlots;
export type TagInputItemTextProps = ArkTagsInputItemTextProps;
export type TagInputItemTextSlots = TagInputSlots;
export type TagInputItemDeleteTriggerProps = ArkTagsInputItemDeleteTriggerProps;
export type TagInputItemDeleteTriggerSlots = TagInputSlots;
export type TagInputItemInputProps = ArkTagsInputItemInputProps;
export type TagInputItemInputSlots = TagInputSlots;
export type TagInputInputProps = ArkTagsInputInputProps;
export type TagInputInputSlots = TagInputSlots;
export type TagInputClearTriggerProps = ArkTagsInputClearTriggerProps;
export type TagInputClearTriggerSlots = TagInputSlots;
export type TagInputHiddenInputProps = ArkTagsInputHiddenInputProps;
export type TagInputHiddenInputSlots = TagInputSlots;

export interface TagInputContextSlots {
  default?: (context: TagInputContextValue) => VNodeChild;
}

export interface TagInputItemContextSlots {
  default?: (context: TagInputItemContextValue) => VNodeChild;
}

export const isTagInputSize = (value: unknown): value is TagInputSize =>
  typeof value === "string" && TAG_INPUT_SIZES.includes(value as TagInputSize);

export const resolveTagInputSize = (value: unknown): TagInputSize =>
  isTagInputSize(value) ? value : TAG_INPUT_DEFAULT_SIZE;

export type {
  TagsInputFocusOutsideEvent,
  TagsInputHighlightChangeDetails,
  TagsInputInputValueChangeDetails,
  TagsInputInteractOutsideEvent,
  TagsInputPointerDownOutsideEvent,
  TagsInputValidityChangeDetails,
  TagsInputValueChangeDetails,
  UseTagsInputContext,
  UseTagsInputItemContext,
  UseTagsInputReturn,
};
