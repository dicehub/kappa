import type { Component, VNodeChild } from "vue";
import type { DropdownDirection, DropdownEmits, DropdownItemVariant, DropdownPositioningOptions } from "../../components/dropdown";

export interface WorkspaceSwitcherItem {
  value: string;
  name: string;
  /** Plan, member count, or other application-provided details. */
  description?: string;
  icon?: Component;
  avatarSrc?: string;
  initials?: string;
  disabled?: boolean;
  shortcut?: string;
  ariaKeyshortcuts?: string;
}

export interface WorkspaceSwitcherAction {
  value: string;
  label: string;
  icon?: Component;
  disabled?: boolean;
  variant?: DropdownItemVariant;
  accent?: boolean;
}

export const WORKSPACE_SWITCHER_DEFAULT_POSITIONING = {
  placement: "bottom-start", strategy: "fixed", gutter: 6, fitViewport: true, overflowPadding: 8,
} as const satisfies DropdownPositioningOptions;

export interface WorkspaceSwitcherProps {
  items: readonly WorkspaceSwitcherItem[];
  /** Controlled workspace selection. */
  modelValue: string;
  label?: string;
  placeholder?: string;
  triggerLabel?: string;
  accountLabel?: string;
  /** Actions below the current workspace details. */
  actions?: readonly WorkspaceSwitcherAction[];
  /** Actions below the workspace list, such as creation or browsing. */
  workspaceActions?: readonly WorkspaceSwitcherAction[];
  footerActions?: readonly WorkspaceSwitcherAction[];
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  dir?: DropdownDirection;
  positioning?: DropdownPositioningOptions;
  /** Disable inside a mobile drawer to keep its menu in the dialog. */
  teleport?: boolean;
}

export type WorkspaceSwitcherEmits = {
  "update:modelValue": [value: string];
  "update:open": [value: boolean];
  openChange: [details: DropdownEmits["openChange"][0]];
  action: [action: WorkspaceSwitcherAction];
};

export interface WorkspaceSwitcherSlots {
  /** One button or link. Bind disabled when supplying a custom trigger. */
  trigger?: (context: { workspace: WorkspaceSwitcherItem | undefined; disabled: boolean }) => VNodeChild;
}
