import type { InjectionKey, Ref, VNodeChild } from "vue";
import type { DropdownEmits } from "../dropdown";

export interface MenuBarProps {
  /** Currently open top-level menu. Use with v-model. */
  modelValue?: string | null;
  /** Initially open menu when uncontrolled. */
  defaultValue?: string | null;
  /** Disable all menu triggers. */
  disabled?: boolean;
}

export interface MenuBarMenuProps {
  /** Unique key for this top-level menu. */
  value: string;
  /** Accessible label for its popup when trigger text is insufficient. */
  ariaLabel?: string;
}

export interface MenuBarTriggerProps {
  asChild?: boolean;
  disabled?: boolean;
}

export interface MenuBarContentProps {
  asChild?: boolean;
  teleport?: boolean;
  teleportTo?: string | HTMLElement;
}

export interface MenuBarSlots {
  default?: () => VNodeChild;
}

export type MenuBarEmits = { "update:modelValue": [value: string | null] };
export type MenuBarMenuEmits = { select: [details: DropdownEmits["select"][0]] };

export interface MenuBarContext {
  activeValue: Ref<string | null>;
  pendingPointerValue: Ref<string | null>;
  rovingValue: Ref<string | null>;
  disabled: Ref<boolean>;
  setActive: (value: string | null) => void;
  switchByPointer: (value: string) => void;
  refreshRoving: () => void;
  move: (from: string, direction: -1 | 1, keepOpen: boolean) => void;
  focusEdge: (edge: "first" | "last", keepOpen: boolean) => void;
}

export interface MenuBarMenuContext {
  value: string;
}

export const menuBarContextKey: InjectionKey<MenuBarContext> = Symbol("kappa-menu-bar");
export const menuBarMenuContextKey: InjectionKey<MenuBarMenuContext> = Symbol("kappa-menu-bar-menu");
