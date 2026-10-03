import type {
  MenuArrowProps as ArkMenuArrowProps,
  MenuCheckboxItemProps as ArkMenuCheckboxItemProps,
  MenuContentProps as ArkMenuContentProps,
  MenuContextTriggerProps as ArkMenuContextTriggerProps,
  MenuFocusOutsideEvent,
  MenuHighlightChangeDetails,
  MenuIndicatorProps as ArkMenuIndicatorProps,
  MenuInteractOutsideEvent,
  MenuItemContextProps as ArkMenuItemContextProps,
  MenuItemGroupLabelProps as ArkMenuItemGroupLabelProps,
  MenuItemGroupProps as ArkMenuItemGroupProps,
  MenuItemIndicatorProps as ArkMenuItemIndicatorProps,
  MenuItemProps as ArkMenuItemProps,
  MenuItemTextProps as ArkMenuItemTextProps,
  MenuOpenChangeDetails,
  MenuPointerDownOutsideEvent,
  MenuRadioItemGroupProps as ArkMenuRadioItemGroupProps,
  MenuRadioItemProps as ArkMenuRadioItemProps,
  MenuRootProps as ArkMenuRootProps,
  MenuSelectionDetails,
  MenuSeparatorProps as ArkMenuSeparatorProps,
  MenuTriggerItemProps as ArkMenuTriggerItemProps,
  MenuTriggerProps as ArkMenuTriggerProps,
  MenuTriggerValueChangeDetails,
  UseMenuContext,
  UseMenuItemContext,
  UseMenuReturn,
} from "@ark-ui/vue/menu";
import type {
  ButtonHTMLAttributes,
  Component,
  TeleportProps,
  UnwrapRef,
  VNodeChild,
} from "vue";

export type {
  MenuFocusOutsideEvent as DropdownFocusOutsideEvent,
  MenuHighlightChangeDetails as DropdownHighlightChangeDetails,
  MenuInteractOutsideEvent as DropdownInteractOutsideEvent,
  MenuOpenChangeDetails as DropdownOpenChangeDetails,
  MenuPointerDownOutsideEvent as DropdownPointerDownOutsideEvent,
  MenuSelectionDetails as DropdownSelectionDetails,
  MenuTriggerValueChangeDetails as DropdownTriggerValueChangeDetails,
} from "@ark-ui/vue/menu";

export const DROPDOWN_ITEM_VARIANTS = ["default", "destructive"] as const;
export type DropdownItemVariant = (typeof DROPDOWN_ITEM_VARIANTS)[number];
export const DROPDOWN_DEFAULT_ITEM_VARIANT = "default" satisfies DropdownItemVariant;

export const isDropdownItemVariant = (value: unknown): value is DropdownItemVariant =>
  typeof value === "string" && DROPDOWN_ITEM_VARIANTS.includes(value as DropdownItemVariant);

export const resolveDropdownItemVariant = (value: unknown): DropdownItemVariant =>
  isDropdownItemVariant(value) ? value : DROPDOWN_DEFAULT_ITEM_VARIANT;

export type DropdownPositioningOptions = NonNullable<ArkMenuRootProps["positioning"]>;
export type DropdownDirection = "ltr" | "rtl";

export const DROPDOWN_DEFAULT_POSITIONING = {
  fitViewport: true,
  gutter: 6,
  overflowPadding: 8,
  placement: "bottom-start",
} as const satisfies DropdownPositioningOptions;

export const DROPDOWN_SUB_DEFAULT_POSITIONING = {
  fitViewport: true,
  gutter: 0,
  overflowPadding: 8,
  placement: "right-start",
} as const satisfies DropdownPositioningOptions;

export type DropdownApi = UseMenuReturn;
export type DropdownContextValue = UnwrapRef<UseMenuContext>;
export type DropdownItemContextValue = UnwrapRef<UseMenuItemContext>;

export type DropdownRequestDismissEvent = CustomEvent<{
  originalIndex: number;
  originalLayer: HTMLElement;
  targetIndex: number;
  targetLayer: HTMLElement | undefined;
}>;

export interface DropdownProps {
  anchorPoint?: ArkMenuRootProps["anchorPoint"];
  ariaLabel?: ArkMenuRootProps["aria-label"];
  closeOnSelect?: ArkMenuRootProps["closeOnSelect"];
  composite?: ArkMenuRootProps["composite"];
  defaultHighlightedValue?: ArkMenuRootProps["defaultHighlightedValue"];
  defaultOpen?: ArkMenuRootProps["defaultOpen"];
  defaultTriggerValue?: ArkMenuRootProps["defaultTriggerValue"];
  dir?: DropdownDirection;
  highlightedValue?: ArkMenuRootProps["highlightedValue"];
  id?: ArkMenuRootProps["id"];
  ids?: ArkMenuRootProps["ids"];
  lazyMount?: ArkMenuRootProps["lazyMount"];
  loopFocus?: ArkMenuRootProps["loopFocus"];
  navigate?: ArkMenuRootProps["navigate"];
  open?: ArkMenuRootProps["open"];
  positioning?: ArkMenuRootProps["positioning"];
  triggerValue?: ArkMenuRootProps["triggerValue"];
  typeahead?: ArkMenuRootProps["typeahead"];
  unmountOnExit?: ArkMenuRootProps["unmountOnExit"];
}

export type DropdownRootProps = DropdownProps;
export type DropdownSubProps = DropdownProps;

export type DropdownEmits = {
  escapeKeyDown: [event: KeyboardEvent];
  exitComplete: [];
  focusOutside: [event: MenuFocusOutsideEvent];
  highlightChange: [details: MenuHighlightChangeDetails];
  interactOutside: [event: MenuInteractOutsideEvent];
  openChange: [details: MenuOpenChangeDetails];
  pointerDownOutside: [event: MenuPointerDownOutsideEvent];
  requestDismiss: [event: DropdownRequestDismissEvent];
  select: [details: MenuSelectionDetails];
  triggerValueChange: [details: MenuTriggerValueChangeDetails];
  "update:highlightedValue": [value: string | null];
  "update:open": [value: boolean];
  "update:triggerValue": [value: string | null];
};

export interface DropdownSlots {
  default?: () => VNodeChild;
}

export type DropdownRootSlots = DropdownSlots;
export type DropdownSubEmits = DropdownEmits;
export type DropdownSubSlots = DropdownSlots;

export interface DropdownRootProviderProps {
  value: DropdownApi;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
}

export type DropdownRootProviderEmits = { exitComplete: [] };
export type DropdownRootProviderSlots = DropdownSlots;

export interface DropdownTriggerProps {
  asChild?: ArkMenuTriggerProps["asChild"];
  value?: ArkMenuTriggerProps["value"];
}

export type DropdownTriggerSlots = DropdownSlots;

export interface DropdownIndicatorProps {
  asChild?: ArkMenuIndicatorProps["asChild"];
}

export type DropdownIndicatorSlots = DropdownSlots;

export interface DropdownContextTriggerProps {
  asChild?: ArkMenuContextTriggerProps["asChild"];
  type?: ButtonHTMLAttributes["type"];
}

export type DropdownContextTriggerSlots = DropdownSlots;

export interface DropdownContentProps {
  asChild?: ArkMenuContentProps["asChild"];
  /** Keep the popup in the component DOM tree when false. */
  teleport?: boolean;
  /** Target for the popup teleport. */
  teleportTo?: TeleportProps["to"];
}

export type DropdownContentSlots = DropdownSlots;
export type DropdownSubContentProps = DropdownContentProps;
export type DropdownSubContentSlots = DropdownSlots;

export interface DropdownArrowProps {
  asChild?: ArkMenuArrowProps["asChild"];
}

export type DropdownArrowSlots = DropdownSlots;

export interface DropdownItemProps {
  asChild?: ArkMenuItemProps["asChild"];
  closeOnSelect?: ArkMenuItemProps["closeOnSelect"];
  disabled?: ArkMenuItemProps["disabled"];
  icon?: Component;
  iconProps?: Record<string, unknown>;
  inset?: boolean;
  selected?: boolean;
  value: ArkMenuItemProps["value"];
  valueText?: ArkMenuItemProps["valueText"];
  variant?: DropdownItemVariant;
}

export type DropdownItemEmits = { select: [] };

export interface DropdownItemSlots {
  default?: () => VNodeChild;
  end?: () => VNodeChild;
  icon?: () => VNodeChild;
  selected?: () => VNodeChild;
}

export interface DropdownLinkItemProps
  extends Omit<DropdownItemProps, "asChild" | "selected" | "value"> {
  href: string;
  rel?: string;
  target?: string;
  value?: string;
}

export type DropdownLinkItemEmits = DropdownItemEmits;
export type DropdownLinkItemSlots = Omit<DropdownItemSlots, "selected">;

export interface DropdownCheckboxItemProps {
  asChild?: ArkMenuCheckboxItemProps["asChild"];
  checked?: boolean;
  closeOnSelect?: ArkMenuCheckboxItemProps["closeOnSelect"];
  defaultChecked?: boolean;
  disabled?: ArkMenuCheckboxItemProps["disabled"];
  inset?: boolean;
  value: ArkMenuCheckboxItemProps["value"];
  valueText?: ArkMenuCheckboxItemProps["valueText"];
}

export type DropdownCheckboxItemEmits = {
  checkedChange: [value: boolean];
  "update:checked": [value: boolean];
};

export interface DropdownCheckboxItemSlots {
  default?: () => VNodeChild;
  end?: () => VNodeChild;
  indicator?: () => VNodeChild;
}

export interface DropdownRadioGroupProps {
  asChild?: ArkMenuRadioItemGroupProps["asChild"];
  defaultValue?: string;
  id?: ArkMenuRadioItemGroupProps["id"];
  modelValue?: ArkMenuRadioItemGroupProps["modelValue"];
}

export type DropdownRadioGroupEmits = {
  valueChange: [value: string];
  "update:modelValue": [value: string];
};

export type DropdownRadioGroupSlots = DropdownSlots;

export interface DropdownRadioItemProps {
  asChild?: ArkMenuRadioItemProps["asChild"];
  closeOnSelect?: ArkMenuRadioItemProps["closeOnSelect"];
  disabled?: ArkMenuRadioItemProps["disabled"];
  inset?: boolean;
  value: ArkMenuRadioItemProps["value"];
  valueText?: ArkMenuRadioItemProps["valueText"];
}

export interface DropdownRadioItemSlots {
  default?: () => VNodeChild;
  end?: () => VNodeChild;
  indicator?: () => VNodeChild;
}

export interface DropdownGroupProps {
  asChild?: ArkMenuItemGroupProps["asChild"];
  id?: ArkMenuItemGroupProps["id"];
}

export type DropdownGroupSlots = DropdownSlots;

export interface DropdownLabelProps {
  asChild?: ArkMenuItemGroupLabelProps["asChild"];
  inset?: boolean;
}

export type DropdownLabelSlots = DropdownSlots;

export interface DropdownItemIndicatorProps {
  asChild?: ArkMenuItemIndicatorProps["asChild"];
}

export type DropdownItemIndicatorSlots = DropdownSlots;

export interface DropdownItemTextProps {
  asChild?: ArkMenuItemTextProps["asChild"];
}

export type DropdownItemTextSlots = DropdownSlots;

export interface DropdownSeparatorProps {
  asChild?: ArkMenuSeparatorProps["asChild"];
}

export type DropdownSeparatorSlots = DropdownSlots;

export interface DropdownSubTriggerProps {
  asChild?: ArkMenuTriggerItemProps["asChild"];
  disabled?: boolean;
  icon?: Component;
  iconProps?: Record<string, unknown>;
  inset?: boolean;
}

export interface DropdownSubTriggerSlots {
  default?: () => VNodeChild;
  end?: () => VNodeChild;
  icon?: () => VNodeChild;
}

export interface DropdownContextSlots {
  default?: (context: DropdownContextValue) => VNodeChild;
}

export interface DropdownItemContextSlots {
  default?: (context: DropdownItemContextValue) => VNodeChild;
}
