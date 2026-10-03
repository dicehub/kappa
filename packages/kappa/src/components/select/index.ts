import SelectRoot from "./Select.vue";
import SelectClearTrigger from "./SelectClearTrigger.vue";
import SelectContent from "./SelectContent.vue";
import SelectContext from "./SelectContext.vue";
import SelectControl from "./SelectControl.vue";
import SelectGroup from "./SelectGroup.vue";
import SelectGroupLabel from "./SelectGroupLabel.vue";
import SelectHiddenSelect from "./SelectHiddenSelect.vue";
import SelectIndicator from "./SelectIndicator.vue";
import SelectItem from "./SelectItem.vue";
import SelectItemContext from "./SelectItemContext.vue";
import SelectItemIndicator from "./SelectItemIndicator.vue";
import SelectItemText from "./SelectItemText.vue";
import SelectLabel from "./SelectLabel.vue";
import SelectList from "./SelectList.vue";
import SelectPositioner from "./SelectPositioner.vue";
import SelectRootProvider from "./SelectRootProvider.vue";
import SelectSeparator from "./SelectSeparator.vue";
import SelectTrigger from "./SelectTrigger.vue";
import SelectValueText from "./SelectValueText.vue";

/** Alias that reads naturally in option-oriented compositions. */
const SelectOption = SelectItem;

export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  RootProvider: SelectRootProvider,
  Trigger: SelectTrigger,
  ValueText: SelectValueText,
  Indicator: SelectIndicator,
  ClearTrigger: SelectClearTrigger,
  Control: SelectControl,
  Content: SelectContent,
  Label: SelectLabel,
  Positioner: SelectPositioner,
  List: SelectList,
  Item: SelectItem,
  Option: SelectOption,
  ItemText: SelectItemText,
  ItemIndicator: SelectItemIndicator,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
  HiddenSelect: SelectHiddenSelect,
  Context: SelectContext,
  ItemContext: SelectItemContext,
});

export {
  SelectClearTrigger,
  SelectContent,
  SelectContext,
  SelectControl,
  SelectGroup,
  SelectGroupLabel,
  SelectHiddenSelect,
  SelectIndicator,
  SelectItem,
  SelectItemContext,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectOption,
  SelectPositioner,
  SelectRoot,
  SelectRootProvider,
  SelectSeparator,
  SelectTrigger,
  SelectValueText,
};

export type {
  SelectApi,
  SelectClearTriggerProps,
  SelectClearTriggerSlots,
  SelectCollection,
  SelectContentProps,
  SelectContentSlots,
  SelectContextSlots,
  SelectContextValue,
  SelectControlProps,
  SelectControlSlots,
  SelectDirection,
  SelectEmits,
  SelectGroupLabelProps,
  SelectGroupLabelSlots,
  SelectGroupProps,
  SelectGroupSlots,
  SelectHiddenSelectProps,
  SelectHiddenSelectSlots,
  SelectIndicatorProps,
  SelectIndicatorSlots,
  SelectItemContextSlots,
  SelectItemContextValue,
  SelectItemDisabled,
  SelectItemIndicatorProps,
  SelectItemIndicatorSlots,
  SelectItemMapper,
  SelectItemProps,
  SelectItemSlots,
  SelectItemTextProps,
  SelectItemTextSlots,
  SelectLabelProps,
  SelectLabelSlots,
  SelectListProps,
  SelectListSlots,
  SelectPartProps,
  SelectPartSlots,
  SelectPositionerPrimitiveProps,
  SelectPositionerProps,
  SelectPositionerSlots,
  SelectProps,
  SelectRootProps,
  SelectRootProviderEmits,
  SelectRootProviderProps,
  SelectRootProviderSlots,
  SelectRootSlots,
  SelectSeparatorProps,
  SelectSeparatorSlots,
  SelectSelectionDetails,
  SelectSize,
  SelectSlots,
  SelectTriggerProps,
  SelectTriggerSlots,
  SelectValueTextProps,
  SelectValueTextSlots,
} from "./select";

export {
  getSelectContentLabel,
  getSelectItemDisabled,
  getSelectItemString,
  getSelectItemValue,
  isSelectRecord,
  SELECT_DEFAULT_SIZE,
  SELECT_SIZES,
} from "./select";

export {
  createListCollection as createSelectCollection,
  selectAnatomy,
  useListCollection as useSelectCollection,
  useSelect,
  useSelectContext,
  useSelectItemContext,
} from "@ark-ui/vue/select";

export type {
  CollectionItem as SelectCollectionItem,
  ListCollection as SelectListCollection,
  SelectFocusOutsideEvent,
  SelectHighlightChangeDetails,
  SelectInteractOutsideEvent,
  SelectOpenChangeDetails,
  SelectPointerDownOutsideEvent,
  SelectValueChangeDetails,
  UseSelectContext,
  UseSelectItemContext,
  UseSelectReturn,
} from "@ark-ui/vue/select";
