import ComboboxRoot from "./Combobox.vue";
import ComboboxChip from "./ComboboxChip.vue";
import ComboboxClearTrigger from "./ComboboxClearTrigger.vue";
import ComboboxContent from "./ComboboxContent.vue";
import ComboboxContext from "./ComboboxContext.vue";
import ComboboxControl from "./ComboboxControl.vue";
import ComboboxEmpty from "./ComboboxEmpty.vue";
import ComboboxGroup from "./ComboboxGroup.vue";
import ComboboxGroupLabel from "./ComboboxGroupLabel.vue";
import ComboboxInput from "./ComboboxInput.vue";
import ComboboxItem from "./ComboboxItem.vue";
import ComboboxItemIndicator from "./ComboboxItemIndicator.vue";
import ComboboxItemText from "./ComboboxItemText.vue";
import ComboboxLabel from "./ComboboxLabel.vue";
import ComboboxList from "./ComboboxList.vue";
import ComboboxSeparator from "./ComboboxSeparator.vue";
import ComboboxTrigger from "./ComboboxTrigger.vue";
import ComboboxTriggerInput from "./ComboboxTriggerInput.vue";
import ComboboxTriggerMultipleWithInput from "./ComboboxTriggerMultipleWithInput.vue";
import ComboboxTriggerValue from "./ComboboxTriggerValue.vue";
import ComboboxValue from "./ComboboxValue.vue";

export const Combobox = Object.assign(ComboboxRoot, {
  Root: ComboboxRoot,
  Chip: ComboboxChip,
  ClearTrigger: ComboboxClearTrigger,
  Content: ComboboxContent,
  Context: ComboboxContext,
  Control: ComboboxControl,
  Empty: ComboboxEmpty,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Input: ComboboxInput,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  ItemText: ComboboxItemText,
  Label: ComboboxLabel,
  List: ComboboxList,
  Separator: ComboboxSeparator,
  Trigger: ComboboxTrigger,
  TriggerInput: ComboboxTriggerInput,
  TriggerMultipleWithInput: ComboboxTriggerMultipleWithInput,
  TriggerValue: ComboboxTriggerValue,
  Value: ComboboxValue,
});

export {
  ComboboxChip,
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxContext,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxTriggerInput,
  ComboboxTriggerMultipleWithInput,
  ComboboxTriggerValue,
  ComboboxValue,
};

export type {
  ComboboxChipProps,
  ComboboxCollection,
  ComboboxContentProps,
  ComboboxControlProps,
  ComboboxEmits,
  ComboboxFilter,
  ComboboxInputAttributes,
  ComboboxInputProps,
  ComboboxItemDisabled,
  ComboboxItemMapper,
  ComboboxItemProps,
  ComboboxListProps,
  ComboboxPositioningOptions,
  ComboboxProps,
  ComboboxRootProps,
  ComboboxSize,
  ComboboxSlots,
  ComboboxTriggerInputProps,
  ComboboxTriggerMultipleWithInputProps,
  ComboboxTriggerValueProps,
  ComboboxValueProps,
} from "./combobox";

export { COMBOBOX_POSITIONING_KEYS, COMBOBOX_SIZES } from "./combobox";

export {
  comboboxAnatomy,
  createListCollection as createComboboxCollection,
  useCombobox,
  useComboboxContext,
  useComboboxItemContext,
  useListCollection as useComboboxCollection,
} from "@ark-ui/vue/combobox";

export type {
  CollectionItem as ComboboxCollectionItem,
  ComboboxClearTriggerProps as ComboboxPrimitiveClearTriggerProps,
  ComboboxContentProps as ComboboxPrimitiveContentProps,
  ComboboxContextProps,
  ComboboxControlProps as ComboboxPrimitiveControlProps,
  ComboboxFocusOutsideEvent,
  ComboboxHighlightChangeDetails,
  ComboboxInputValueChangeDetails,
  ComboboxInteractOutsideEvent,
  ComboboxItemContextProps,
  ComboboxItemGroupLabelProps,
  ComboboxItemGroupProps,
  ComboboxItemIndicatorProps,
  ComboboxItemProps as ComboboxPrimitiveItemProps,
  ComboboxItemTextProps,
  ComboboxLabelProps,
  ComboboxOpenChangeDetails,
  ComboboxPointerDownOutsideEvent,
  ComboboxPositionerProps,
  ComboboxSelectionDetails,
  ComboboxTriggerProps,
  ComboboxValueChangeDetails,
  ListCollection as ComboboxListCollection,
  UseComboboxContext,
  UseComboboxItemContext,
  UseComboboxProps,
  UseComboboxReturn,
  UseListCollectionProps as UseComboboxCollectionProps,
} from "@ark-ui/vue/combobox";

export type { UseListCollectionReturn as UseComboboxCollectionReturn } from "@ark-ui/vue/collection";
