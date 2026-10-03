import ContextMenuRoot from "./ContextMenu.vue";
import ContextMenuArrow from "../dropdown/DropdownArrow.vue";
import ContextMenuCheckboxItem from "../dropdown/DropdownCheckboxItem.vue";
import ContextMenuContent from "../dropdown/DropdownContent.vue";
import ContextMenuContext from "../dropdown/DropdownContext.vue";
import ContextMenuTrigger from "../dropdown/DropdownContextTrigger.vue";
import ContextMenuGroup from "../dropdown/DropdownGroup.vue";
import ContextMenuItem from "../dropdown/DropdownItem.vue";
import ContextMenuItemContext from "../dropdown/DropdownItemContext.vue";
import ContextMenuItemIndicator from "../dropdown/DropdownItemIndicator.vue";
import ContextMenuItemText from "../dropdown/DropdownItemText.vue";
import ContextMenuLabel from "../dropdown/DropdownLabel.vue";
import ContextMenuLinkItem from "../dropdown/DropdownLinkItem.vue";
import ContextMenuRadioGroup from "../dropdown/DropdownRadioGroup.vue";
import ContextMenuRadioItem from "../dropdown/DropdownRadioItem.vue";
import ContextMenuRootProvider from "../dropdown/DropdownRootProvider.vue";
import ContextMenuSeparator from "../dropdown/DropdownSeparator.vue";
import ContextMenuShortcut from "../dropdown/DropdownShortcut.vue";
import ContextMenuSub from "../dropdown/DropdownSub.vue";
import ContextMenuSubContent from "../dropdown/DropdownSubContent.vue";
import ContextMenuSubTrigger from "../dropdown/DropdownSubTrigger.vue";

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Root: ContextMenuRoot,
  RootProvider: ContextMenuRootProvider,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Arrow: ContextMenuArrow,
  Item: ContextMenuItem,
  LinkItem: ContextMenuLinkItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  RadioItemIndicator: ContextMenuItemIndicator,
  Group: ContextMenuGroup,
  Label: ContextMenuLabel,
  GroupLabel: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  Shortcut: ContextMenuShortcut,
  Sub: ContextMenuSub,
  SubTrigger: ContextMenuSubTrigger,
  SubContent: ContextMenuSubContent,
  ItemIndicator: ContextMenuItemIndicator,
  ItemText: ContextMenuItemText,
  Context: ContextMenuContext,
  ItemContext: ContextMenuItemContext,
});

export {
  ContextMenuArrow,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuContext,
  ContextMenuGroup,
  ContextMenuLabel as ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuItemContext,
  ContextMenuItemIndicator,
  ContextMenuItemText,
  ContextMenuLabel,
  ContextMenuLinkItem,
  ContextMenuRadioGroup,
  ContextMenuItemIndicator as ContextMenuRadioItemIndicator,
  ContextMenuRadioItem,
  ContextMenuRoot,
  ContextMenuRootProvider,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};

export {
  CONTEXT_MENU_DEFAULT_ITEM_VARIANT,
  CONTEXT_MENU_DEFAULT_POSITIONING,
  CONTEXT_MENU_ITEM_VARIANTS,
  isContextMenuItemVariant,
  resolveContextMenuItemVariant,
} from "./context-menu";

export type * from "./context-menu";

export {
  menuAnatomy as contextMenuAnatomy,
  useMenu as useContextMenu,
  useMenuContext as useContextMenuContext,
  useMenuItemContext as useContextMenuItemContext,
} from "@ark-ui/vue/menu";

export type {
  UseMenuContext as UseContextMenuContext,
  UseMenuItemContext as UseContextMenuItemContext,
  UseMenuProps as UseContextMenuProps,
  UseMenuReturn as UseContextMenuReturn,
} from "@ark-ui/vue/menu";
