import type {
  DrawerBackdropProps as ArkDrawerBackdropProps,
  DrawerCloseTriggerProps as ArkDrawerCloseTriggerProps,
  DrawerContentProps as ArkDrawerContentProps,
  DrawerDescriptionProps as ArkDrawerDescriptionProps,
  DrawerGrabberIndicatorProps as ArkDrawerGrabberIndicatorProps,
  DrawerGrabberProps as ArkDrawerGrabberProps,
  DrawerIndentBackgroundProps as ArkDrawerIndentBackgroundProps,
  DrawerIndentProps as ArkDrawerIndentProps,
  DrawerOpenChangeDetails,
  DrawerPositionerProps as ArkDrawerPositionerProps,
  DrawerRootProps as ArkDrawerRootProps,
  DrawerRootProviderProps as ArkDrawerRootProviderProps,
  DrawerSnapPointChangeDetails,
  DrawerSwipeAreaProps as ArkDrawerSwipeAreaProps,
  DrawerTitleProps as ArkDrawerTitleProps,
  DrawerTriggerProps as ArkDrawerTriggerProps,
  DrawerTriggerValueChangeDetails,
  UseDrawerContext,
  UseDrawerReturn,
} from "@ark-ui/vue/drawer";
import type { TeleportProps, UnwrapRef, VNodeChild } from "vue";

export type {
  DrawerOpenChangeDetails,
  DrawerSnapPointChangeDetails,
  DrawerTriggerValueChangeDetails,
} from "@ark-ui/vue/drawer";

export const DRAWER_SWIPE_DIRECTIONS = ["up", "down", "start", "end"] as const;
export const DRAWER_ROLES = ["dialog", "alertdialog"] as const;

export type DrawerSwipeDirection = (typeof DRAWER_SWIPE_DIRECTIONS)[number];
export type DrawerRole = (typeof DRAWER_ROLES)[number];
export type DrawerSnapPoint = NonNullable<ArkDrawerRootProps["snapPoints"]>[number];
export type DrawerApi = UnwrapRef<UseDrawerReturn>;
export type DrawerContextValue = UnwrapRef<UseDrawerContext>;

export const DRAWER_DEFAULT_SWIPE_DIRECTION = "down" satisfies DrawerSwipeDirection;
export const DRAWER_DEFAULT_ROLE = "dialog" satisfies DrawerRole;

export interface DrawerProps {
  closeOnEscape?: ArkDrawerRootProps["closeOnEscape"];
  closeOnInteractOutside?: ArkDrawerRootProps["closeOnInteractOutside"];
  closeThreshold?: ArkDrawerRootProps["closeThreshold"];
  defaultOpen?: ArkDrawerRootProps["defaultOpen"];
  defaultSnapPoint?: ArkDrawerRootProps["defaultSnapPoint"];
  defaultTriggerValue?: ArkDrawerRootProps["defaultTriggerValue"];
  finalFocusEl?: ArkDrawerRootProps["finalFocusEl"];
  id?: ArkDrawerRootProps["id"];
  ids?: ArkDrawerRootProps["ids"];
  initialFocusEl?: ArkDrawerRootProps["initialFocusEl"];
  lazyMount?: ArkDrawerRootProps["lazyMount"];
  /** Locale used by Ark UI to resolve logical start and end directions. */
  locale?: string;
  modal?: ArkDrawerRootProps["modal"];
  open?: ArkDrawerRootProps["open"];
  preventDragOnScroll?: ArkDrawerRootProps["preventDragOnScroll"];
  preventScroll?: ArkDrawerRootProps["preventScroll"];
  restoreFocus?: ArkDrawerRootProps["restoreFocus"];
  role?: DrawerRole;
  snapPoint?: ArkDrawerRootProps["snapPoint"];
  snapPoints?: ArkDrawerRootProps["snapPoints"];
  snapToSequentialPoints?: ArkDrawerRootProps["snapToSequentialPoints"];
  swipeDirection?: DrawerSwipeDirection;
  swipeVelocityThreshold?: ArkDrawerRootProps["swipeVelocityThreshold"];
  trapFocus?: ArkDrawerRootProps["trapFocus"];
  triggerValue?: ArkDrawerRootProps["triggerValue"];
  unmountOnExit?: ArkDrawerRootProps["unmountOnExit"];
}

export type DrawerRootProps = DrawerProps;

export type DrawerEmits = {
  exitComplete: [];
  openChange: [details: DrawerOpenChangeDetails];
  snapPointChange: [details: DrawerSnapPointChangeDetails];
  triggerValueChange: [details: DrawerTriggerValueChangeDetails];
  "update:open": [open: boolean];
  "update:snapPoint": [snapPoint: DrawerSnapPoint | null];
  "update:triggerValue": [triggerValue: string | null];
};

export interface DrawerSlots {
  default?: () => VNodeChild;
}

export type DrawerRootSlots = DrawerSlots;

export interface DrawerRootProviderProps {
  value: DrawerApi;
  lazyMount?: ArkDrawerRootProviderProps["lazyMount"];
  unmountOnExit?: ArkDrawerRootProviderProps["unmountOnExit"];
}

export type DrawerRootProviderEmits = { exitComplete: [] };
export type DrawerRootProviderSlots = DrawerSlots;

export interface DrawerTriggerProps {
  asChild?: ArkDrawerTriggerProps["asChild"];
  value?: ArkDrawerTriggerProps["value"];
}

export type DrawerTriggerSlots = DrawerSlots;

export interface DrawerBackdropProps {
  asChild?: ArkDrawerBackdropProps["asChild"];
}

export type DrawerBackdropSlots = DrawerSlots;

export interface DrawerPositionerProps {
  asChild?: ArkDrawerPositionerProps["asChild"];
}

export type DrawerPositionerSlots = DrawerSlots;

export interface DrawerContentProps {
  /** Accessible label for the optional built-in close control. */
  closeLabel?: string;
  draggable?: ArkDrawerContentProps["draggable"];
  /** Renders the modal backdrop. Disable this for non-modal drawers. */
  showBackdrop?: boolean;
  /** Renders a built-in corner close control. */
  showCloseButton?: boolean;
  /** Renders the directional drag handle. */
  showGrabber?: boolean;
  /** Teleports the backdrop and content. */
  teleport?: boolean;
  teleportTo?: TeleportProps["to"];
}

export interface DrawerContentSlots {
  default?: () => VNodeChild;
  /** Replaces the built-in close control. Include Drawer.Close in this slot. */
  close?: () => VNodeChild;
  /** Replaces the default directional grabber. */
  grabber?: () => VNodeChild;
}

export interface DrawerCloseProps {
  asChild?: ArkDrawerCloseTriggerProps["asChild"];
  /** Accessible label used by the built-in icon control. */
  label?: string;
}

export type DrawerCloseSlots = DrawerSlots;
export type DrawerCloseTriggerProps = DrawerCloseProps;
export type DrawerCloseTriggerSlots = DrawerCloseSlots;

export interface DrawerTitleProps {
  asChild?: ArkDrawerTitleProps["asChild"];
}

export type DrawerTitleSlots = DrawerSlots;

export interface DrawerDescriptionProps {
  asChild?: ArkDrawerDescriptionProps["asChild"];
}

export type DrawerDescriptionSlots = DrawerSlots;

export interface DrawerGrabberProps {
  asChild?: ArkDrawerGrabberProps["asChild"];
}

export type DrawerGrabberSlots = DrawerSlots;

export interface DrawerGrabberIndicatorProps {
  asChild?: ArkDrawerGrabberIndicatorProps["asChild"];
}

export type DrawerGrabberIndicatorSlots = DrawerSlots;

export interface DrawerSwipeAreaProps {
  asChild?: ArkDrawerSwipeAreaProps["asChild"];
}

export type DrawerSwipeAreaSlots = DrawerSlots;

export interface DrawerIndentProps {
  asChild?: ArkDrawerIndentProps["asChild"];
}

export type DrawerIndentSlots = DrawerSlots;

export interface DrawerIndentBackgroundProps {
  asChild?: ArkDrawerIndentBackgroundProps["asChild"];
}

export type DrawerIndentBackgroundSlots = DrawerSlots;
export type DrawerHeaderSlots = DrawerSlots;
export type DrawerFooterSlots = DrawerSlots;
export type DrawerStackSlots = DrawerSlots;

export interface DrawerContextSlots {
  default?: (context: DrawerContextValue) => VNodeChild;
}
