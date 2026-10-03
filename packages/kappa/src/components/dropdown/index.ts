import DropdownRoot from "./Dropdown.vue";
import DropdownArrow from "./DropdownArrow.vue";
import DropdownCheckboxItem from "./DropdownCheckboxItem.vue";
import DropdownContent from "./DropdownContent.vue";
import DropdownContext from "./DropdownContext.vue";
import DropdownContextTrigger from "./DropdownContextTrigger.vue";
import DropdownGroup from "./DropdownGroup.vue";
import DropdownIndicator from "./DropdownIndicator.vue";
import DropdownItem from "./DropdownItem.vue";
import DropdownItemContext from "./DropdownItemContext.vue";
import DropdownItemIndicator from "./DropdownItemIndicator.vue";
import DropdownItemText from "./DropdownItemText.vue";
import DropdownLabel from "./DropdownLabel.vue";
import DropdownLinkItem from "./DropdownLinkItem.vue";
import DropdownRadioGroup from "./DropdownRadioGroup.vue";
import DropdownRadioItem from "./DropdownRadioItem.vue";
import DropdownRootProvider from "./DropdownRootProvider.vue";
import DropdownSeparator from "./DropdownSeparator.vue";
import DropdownShortcut from "./DropdownShortcut.vue";
import DropdownSub from "./DropdownSub.vue";
import DropdownSubContent from "./DropdownSubContent.vue";
import DropdownSubTrigger from "./DropdownSubTrigger.vue";
import DropdownTrigger from "./DropdownTrigger.vue";

export const Dropdown = Object.assign(DropdownRoot, {
  Root: DropdownRoot,
  RootProvider: DropdownRootProvider,
  Trigger: DropdownTrigger,
  Indicator: DropdownIndicator,
  ContextTrigger: DropdownContextTrigger,
  Content: DropdownContent,
  Arrow: DropdownArrow,
  Item: DropdownItem,
  LinkItem: DropdownLinkItem,
  CheckboxItem: DropdownCheckboxItem,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  RadioItemIndicator: DropdownItemIndicator,
  Group: DropdownGroup,
  Label: DropdownLabel,
  GroupLabel: DropdownLabel,
  Separator: DropdownSeparator,
  Shortcut: DropdownShortcut,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent,
  ItemIndicator: DropdownItemIndicator,
  ItemText: DropdownItemText,
  Context: DropdownContext,
  ItemContext: DropdownItemContext,
});

export {
  DropdownArrow,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownContext,
  DropdownContextTrigger,
  DropdownGroup,
  DropdownLabel as DropdownGroupLabel,
  DropdownIndicator,
  DropdownItem,
  DropdownItemContext,
  DropdownItemIndicator,
  DropdownItemText,
  DropdownLabel,
  DropdownLinkItem,
  DropdownRadioGroup,
  DropdownItemIndicator as DropdownRadioItemIndicator,
  DropdownRadioItem,
  DropdownRoot,
  DropdownRootProvider,
  DropdownSeparator,
  DropdownShortcut,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
};

export {
  DROPDOWN_DEFAULT_ITEM_VARIANT,
  DROPDOWN_DEFAULT_POSITIONING,
  DROPDOWN_ITEM_VARIANTS,
  DROPDOWN_SUB_DEFAULT_POSITIONING,
  isDropdownItemVariant,
  resolveDropdownItemVariant,
} from "./dropdown";

export type {
  DropdownApi,
  DropdownArrowProps,
  DropdownArrowSlots,
  DropdownCheckboxItemEmits,
  DropdownCheckboxItemProps,
  DropdownCheckboxItemSlots,
  DropdownContentProps,
  DropdownContentSlots,
  DropdownContextSlots,
  DropdownContextTriggerProps,
  DropdownContextTriggerSlots,
  DropdownContextValue,
  DropdownEmits,
  DropdownDirection,
  DropdownGroupProps,
  DropdownGroupSlots,
  DropdownIndicatorProps,
  DropdownIndicatorSlots,
  DropdownItemContextSlots,
  DropdownItemContextValue,
  DropdownItemEmits,
  DropdownItemIndicatorProps,
  DropdownItemIndicatorSlots,
  DropdownItemProps,
  DropdownItemSlots,
  DropdownItemTextProps,
  DropdownItemTextSlots,
  DropdownItemVariant,
  DropdownLabelProps,
  DropdownLabelSlots,
  DropdownLinkItemEmits,
  DropdownLinkItemProps,
  DropdownLinkItemSlots,
  DropdownPositioningOptions,
  DropdownProps,
  DropdownRadioGroupEmits,
  DropdownRadioGroupProps,
  DropdownRadioGroupSlots,
  DropdownRadioItemProps,
  DropdownRadioItemSlots,
  DropdownRequestDismissEvent,
  DropdownRootProps,
  DropdownRootProviderEmits,
  DropdownRootProviderProps,
  DropdownRootProviderSlots,
  DropdownRootSlots,
  DropdownSeparatorProps,
  DropdownSeparatorSlots,
  DropdownSlots,
  DropdownSubContentProps,
  DropdownSubContentSlots,
  DropdownSubEmits,
  DropdownSubProps,
  DropdownSubSlots,
  DropdownSubTriggerProps,
  DropdownSubTriggerSlots,
  DropdownTriggerProps,
  DropdownTriggerSlots,
} from "./dropdown";

export {
  menuAnatomy as dropdownAnatomy,
  useMenu as useDropdown,
  useMenuContext as useDropdownContext,
  useMenuItemContext as useDropdownItemContext,
} from "@ark-ui/vue/menu";

export type {
  MenuArrowTipProps as DropdownPrimitiveArrowTipProps,
  MenuPositionerProps as DropdownPrimitivePositionerProps,
  UseMenuContext as UseDropdownContext,
  UseMenuItemContext as UseDropdownItemContext,
  UseMenuProps as UseDropdownProps,
  UseMenuReturn as UseDropdownReturn,
} from "@ark-ui/vue/menu";
