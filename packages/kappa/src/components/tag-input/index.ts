import TagInputRoot from "./TagInput.vue";
import TagInputClearTrigger from "./TagInputClearTrigger.vue";
import TagInputContext from "./TagInputContext.vue";
import TagInputControl from "./TagInputControl.vue";
import TagInputHiddenInput from "./TagInputHiddenInput.vue";
import TagInputInput from "./TagInputInput.vue";
import TagInputItem from "./TagInputItem.vue";
import TagInputItemContext from "./TagInputItemContext.vue";
import TagInputItemDeleteTrigger from "./TagInputItemDeleteTrigger.vue";
import TagInputItemInput from "./TagInputItemInput.vue";
import TagInputItemPreview from "./TagInputItemPreview.vue";
import TagInputItemText from "./TagInputItemText.vue";
import TagInputLabel from "./TagInputLabel.vue";
import TagInputRootProvider from "./TagInputRootProvider.vue";

export const TagInput = Object.assign(TagInputRoot, {
  Root: TagInputRoot,
  RootProvider: TagInputRootProvider,
  Label: TagInputLabel,
  Control: TagInputControl,
  Item: TagInputItem,
  ItemPreview: TagInputItemPreview,
  ItemText: TagInputItemText,
  ItemDeleteTrigger: TagInputItemDeleteTrigger,
  ItemInput: TagInputItemInput,
  Input: TagInputInput,
  ClearTrigger: TagInputClearTrigger,
  HiddenInput: TagInputHiddenInput,
  Context: TagInputContext,
  ItemContext: TagInputItemContext,
});

export {
  TagInputClearTrigger,
  TagInputContext,
  TagInputControl,
  TagInputHiddenInput,
  TagInputInput,
  TagInputItem,
  TagInputItemContext,
  TagInputItemDeleteTrigger,
  TagInputItemInput,
  TagInputItemPreview,
  TagInputItemText,
  TagInputLabel,
  TagInputRoot,
  TagInputRootProvider,
};

export {
  TAG_INPUT_DEFAULT_SIZE,
  TAG_INPUT_SIZES,
  isTagInputSize,
  resolveTagInputSize,
  type TagInputApi,
  type TagInputClearTriggerProps,
  type TagInputClearTriggerSlots,
  type TagInputContextSlots,
  type TagInputContextValue,
  type TagInputControlProps,
  type TagInputControlSlots,
  type TagInputEmits,
  type TagInputHiddenInputProps,
  type TagInputHiddenInputSlots,
  type TagInputHighlightChangeDetails,
  type TagInputInputProps,
  type TagInputInputSlots,
  type TagInputInputValueChangeDetails,
  type TagInputItemContextSlots,
  type TagInputItemContextValue,
  type TagInputItemDeleteTriggerProps,
  type TagInputItemDeleteTriggerSlots,
  type TagInputItemInputProps,
  type TagInputItemInputSlots,
  type TagInputItemPreviewProps,
  type TagInputItemPreviewSlots,
  type TagInputItemProps,
  type TagInputItemSlots,
  type TagInputItemTextProps,
  type TagInputItemTextSlots,
  type TagInputLabelProps,
  type TagInputLabelSlots,
  type TagInputProps,
  type TagInputRootProps,
  type TagInputRootProviderProps,
  type TagInputRootProviderSlots,
  type TagInputRootSlots,
  type TagInputSize,
  type TagInputSlots,
  type TagInputValidityChangeDetails,
  type TagInputValueChangeDetails,
  type TagsInputFocusOutsideEvent,
  type TagsInputHighlightChangeDetails,
  type TagsInputInputValueChangeDetails,
  type TagsInputInteractOutsideEvent,
  type TagsInputPointerDownOutsideEvent,
  type TagsInputValidityChangeDetails,
  type TagsInputValueChangeDetails,
  type UseTagsInputContext,
  type UseTagsInputItemContext,
  type UseTagsInputReturn,
} from "./tag-input";

export {
  tagsInputAnatomy,
  useTagsInput,
  useTagsInputContext,
  useTagsInputItemContext,
  type UseTagsInputProps,
} from "@ark-ui/vue/tags-input";
