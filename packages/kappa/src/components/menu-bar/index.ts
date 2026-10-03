import MenuBarRoot from "./MenuBar.vue";
import MenuBarMenu from "./MenuBarMenu.vue";
import MenuBarTrigger from "./MenuBarTrigger.vue";
import MenuBarContent from "./MenuBarContent.vue";
import MenuBarSubTrigger from "./MenuBarSubTrigger.vue";
import { Dropdown } from "../dropdown";

export const MenuBar = Object.assign(MenuBarRoot, {
  Root: MenuBarRoot,
  Menu: MenuBarMenu,
  Trigger: MenuBarTrigger,
  Content: MenuBarContent,
  Item: Dropdown.Item,
  LinkItem: Dropdown.LinkItem,
  CheckboxItem: Dropdown.CheckboxItem,
  RadioGroup: Dropdown.RadioGroup,
  RadioItem: Dropdown.RadioItem,
  Group: Dropdown.Group,
  Label: Dropdown.Label,
  Separator: Dropdown.Separator,
  Shortcut: Dropdown.Shortcut,
  Sub: Dropdown.Sub,
  SubTrigger: MenuBarSubTrigger,
  SubContent: Dropdown.SubContent,
});

export { MenuBarRoot, MenuBarMenu, MenuBarTrigger, MenuBarContent, MenuBarSubTrigger };
export type {
  MenuBarProps,
  MenuBarMenuProps,
  MenuBarTriggerProps,
  MenuBarContentProps,
  MenuBarEmits,
  MenuBarMenuEmits,
} from "./menu-bar";
