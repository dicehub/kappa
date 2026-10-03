import type {
  PopoverAnchorProps as ArkPopoverAnchorProps,
  PopoverArrowProps as ArkPopoverArrowProps,
  PopoverArrowTipProps as ArkPopoverArrowTipProps,
  PopoverCloseTriggerProps as ArkPopoverCloseTriggerProps,
  PopoverContentProps as ArkPopoverContentProps,
  PopoverDescriptionProps as ArkPopoverDescriptionProps,
  PopoverFocusOutsideEvent,
  PopoverInteractOutsideEvent,
  PopoverOpenChangeDetails,
  PopoverPositionerProps as ArkPopoverPositionerProps,
  PopoverPointerDownOutsideEvent,
  PopoverRootProps as ArkPopoverRootProps,
  PopoverRootProviderProps as ArkPopoverRootProviderProps,
  PopoverTitleProps as ArkPopoverTitleProps,
  PopoverTriggerProps as ArkPopoverTriggerProps,
  PopoverTriggerValueChangeDetails,
  PopoverIndicatorProps as ArkPopoverIndicatorProps,
  UsePopoverContext,
  UsePopoverReturn,
} from "@ark-ui/vue/popover";
import type { TeleportProps, UnwrapRef, VNodeChild } from "vue";

export type {
  PopoverFocusOutsideEvent,
  PopoverInteractOutsideEvent,
  PopoverOpenChangeDetails,
  PopoverPointerDownOutsideEvent,
  PopoverTriggerValueChangeDetails,
} from "@ark-ui/vue/popover";

export type PopoverPositioningOptions = NonNullable<ArkPopoverRootProps["positioning"]>;
export type PopoverDirection = "ltr" | "rtl";
export type PopoverApi = UnwrapRef<UsePopoverReturn>;
export type PopoverContextValue = UnwrapRef<UsePopoverContext>;

export const POPOVER_DEFAULT_POSITIONING = {
  fitViewport: true,
  gutter: 8,
  overflowPadding: 12,
  placement: "bottom",
} as const satisfies PopoverPositioningOptions;

export interface PopoverProps {
  autoFocus?: ArkPopoverRootProps["autoFocus"];
  closeOnEscape?: ArkPopoverRootProps["closeOnEscape"];
  closeOnInteractOutside?: ArkPopoverRootProps["closeOnInteractOutside"];
  defaultOpen?: ArkPopoverRootProps["defaultOpen"];
  defaultTriggerValue?: ArkPopoverRootProps["defaultTriggerValue"];
  /** Overrides the inherited Ark UI locale direction. */
  dir?: PopoverDirection;
  finalFocusEl?: ArkPopoverRootProps["finalFocusEl"];
  id?: ArkPopoverRootProps["id"];
  ids?: ArkPopoverRootProps["ids"];
  initialFocusEl?: ArkPopoverRootProps["initialFocusEl"];
  lazyMount?: boolean;
  modal?: ArkPopoverRootProps["modal"];
  open?: ArkPopoverRootProps["open"];
  persistentElements?: ArkPopoverRootProps["persistentElements"];
  portalled?: ArkPopoverRootProps["portalled"];
  positioning?: ArkPopoverRootProps["positioning"];
  restoreFocus?: ArkPopoverRootProps["restoreFocus"];
  translations?: ArkPopoverRootProps["translations"];
  triggerValue?: ArkPopoverRootProps["triggerValue"];
  unmountOnExit?: boolean;
}

export type PopoverRootProps = PopoverProps;

export type PopoverRequestDismissEvent = CustomEvent<{
  originalIndex: number;
  originalLayer: HTMLElement;
  targetIndex: number;
  targetLayer: HTMLElement | undefined;
}>;

export type PopoverEmits = {
  escapeKeyDown: [event: KeyboardEvent];
  exitComplete: [];
  focusOutside: [event: PopoverFocusOutsideEvent];
  interactOutside: [event: PopoverInteractOutsideEvent];
  openChange: [details: PopoverOpenChangeDetails];
  pointerDownOutside: [event: PopoverPointerDownOutsideEvent];
  requestDismiss: [event: PopoverRequestDismissEvent];
  triggerValueChange: [details: PopoverTriggerValueChangeDetails];
  "update:open": [open: boolean];
  "update:triggerValue": [triggerValue: string | null];
};

export interface PopoverSlots {
  default?: () => VNodeChild;
}

export type PopoverRootSlots = PopoverSlots;

export interface PopoverRootProviderProps {
  value: PopoverApi;
  lazyMount?: ArkPopoverRootProviderProps["lazyMount"];
  unmountOnExit?: ArkPopoverRootProviderProps["unmountOnExit"];
}

export type PopoverRootProviderEmits = { exitComplete: [] };
export type PopoverRootProviderSlots = PopoverSlots;

export interface PopoverTriggerProps {
  asChild?: ArkPopoverTriggerProps["asChild"];
  disabled?: ArkPopoverTriggerProps["disabled"];
  value?: ArkPopoverTriggerProps["value"];
}

export type PopoverTriggerSlots = PopoverSlots;

export interface PopoverAnchorProps {
  asChild?: ArkPopoverAnchorProps["asChild"];
}

export type PopoverAnchorSlots = PopoverSlots;

export interface PopoverPositionerProps {
  asChild?: ArkPopoverPositionerProps["asChild"];
}

export type PopoverPositionerSlots = PopoverSlots;

export interface PopoverContentProps {
  asChild?: ArkPopoverContentProps["asChild"];
  /** Keep the popup in the component DOM tree when false. */
  teleport?: boolean;
  /** Target for the popup teleport. */
  teleportTo?: TeleportProps["to"];
  /** Render the default arrow before the content surface. */
  showArrow?: boolean;
}

export interface PopoverContentSlots {
  default?: () => VNodeChild;
  arrow?: () => VNodeChild;
}

export interface PopoverArrowProps {
  asChild?: ArkPopoverArrowProps["asChild"];
}

export type PopoverArrowSlots = PopoverSlots;

export interface PopoverArrowTipProps {
  asChild?: ArkPopoverArrowTipProps["asChild"];
}

export type PopoverArrowTipSlots = PopoverSlots;

export interface PopoverTitleProps {
  asChild?: ArkPopoverTitleProps["asChild"];
}

export type PopoverTitleSlots = PopoverSlots;

export interface PopoverDescriptionProps {
  asChild?: ArkPopoverDescriptionProps["asChild"];
}

export type PopoverDescriptionSlots = PopoverSlots;

export interface PopoverIndicatorProps {
  asChild?: ArkPopoverIndicatorProps["asChild"];
}

export type PopoverIndicatorSlots = PopoverSlots;

export interface PopoverCloseTriggerProps {
  asChild?: ArkPopoverCloseTriggerProps["asChild"];
  /** Explicit accessible-label override; omit to use Ark UI translations. */
  label?: string;
}

export type PopoverCloseProps = PopoverCloseTriggerProps;
export type PopoverCloseTriggerSlots = PopoverSlots;
export type PopoverCloseSlots = PopoverCloseTriggerSlots;

export interface PopoverContextSlots {
  default?: (context: PopoverContextValue) => VNodeChild;
}
