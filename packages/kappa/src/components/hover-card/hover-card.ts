import type {
  HoverCardArrowProps as ArkHoverCardArrowProps,
  HoverCardArrowTipProps as ArkHoverCardArrowTipProps,
  HoverCardContentProps as ArkHoverCardContentProps,
  HoverCardFocusOutsideEvent,
  HoverCardInteractOutsideEvent,
  HoverCardOpenChangeDetails,
  HoverCardPointerDownOutsideEvent,
  HoverCardPositionerProps as ArkHoverCardPositionerProps,
  HoverCardRootProps as ArkHoverCardRootProps,
  HoverCardRootProviderProps as ArkHoverCardRootProviderProps,
  HoverCardTriggerProps as ArkHoverCardTriggerProps,
  HoverCardTriggerValueChangeDetails,
  UseHoverCardContext,
  UseHoverCardReturn,
} from "@ark-ui/vue/hover-card";
import type { TeleportProps, UnwrapRef, VNodeChild } from "vue";

export type {
  HoverCardFocusOutsideEvent,
  HoverCardInteractOutsideEvent,
  HoverCardOpenChangeDetails,
  HoverCardPointerDownOutsideEvent,
  HoverCardTriggerValueChangeDetails,
} from "@ark-ui/vue/hover-card";

export type HoverCardPositioningOptions = NonNullable<ArkHoverCardRootProps["positioning"]>;
export type HoverCardApi = UnwrapRef<UseHoverCardReturn>;
export type HoverCardContextValue = UnwrapRef<UseHoverCardContext>;

/** Matches the installed Ark UI Hover Card machine defaults. */
export const HOVER_CARD_DEFAULT_OPEN_DELAY = 600;
export const HOVER_CARD_DEFAULT_CLOSE_DELAY = 300;
export const HOVER_CARD_DEFAULT_POSITIONING = {
  fitViewport: true,
  gutter: 8,
  overflowPadding: 12,
  placement: "bottom",
} as const satisfies HoverCardPositioningOptions;

export interface HoverCardProps {
  closeDelay?: ArkHoverCardRootProps["closeDelay"];
  defaultOpen?: ArkHoverCardRootProps["defaultOpen"];
  defaultTriggerValue?: ArkHoverCardRootProps["defaultTriggerValue"];
  disabled?: ArkHoverCardRootProps["disabled"];
  id?: ArkHoverCardRootProps["id"];
  ids?: ArkHoverCardRootProps["ids"];
  lazyMount?: boolean;
  open?: ArkHoverCardRootProps["open"];
  openDelay?: ArkHoverCardRootProps["openDelay"];
  positioning?: ArkHoverCardRootProps["positioning"];
  triggerValue?: ArkHoverCardRootProps["triggerValue"];
  unmountOnExit?: boolean;
}

export type HoverCardRootProps = HoverCardProps;

export type HoverCardEmits = {
  exitComplete: [];
  focusOutside: [event: HoverCardFocusOutsideEvent];
  interactOutside: [event: HoverCardInteractOutsideEvent];
  openChange: [details: HoverCardOpenChangeDetails];
  pointerDownOutside: [event: HoverCardPointerDownOutsideEvent];
  triggerValueChange: [details: HoverCardTriggerValueChangeDetails];
  "update:open": [open: boolean];
  "update:triggerValue": [triggerValue: string | null];
};

export interface HoverCardSlots {
  default?: () => VNodeChild;
}

export type HoverCardRootSlots = HoverCardSlots;

export interface HoverCardRootProviderProps {
  value: HoverCardApi;
  lazyMount?: ArkHoverCardRootProviderProps["lazyMount"];
  unmountOnExit?: ArkHoverCardRootProviderProps["unmountOnExit"];
}

export type HoverCardRootProviderEmits = { exitComplete: [] };
export type HoverCardRootProviderSlots = HoverCardSlots;

export interface HoverCardTriggerProps {
  asChild?: ArkHoverCardTriggerProps["asChild"];
  disabled?: ArkHoverCardTriggerProps["disabled"];
  value?: ArkHoverCardTriggerProps["value"];
}

export type HoverCardTriggerSlots = HoverCardSlots;

export interface HoverCardContentProps {
  asChild?: ArkHoverCardContentProps["asChild"];
  /** Keep the popup in the component DOM tree when false. */
  teleport?: boolean;
  /** Target for the popup teleport. */
  teleportTo?: TeleportProps["to"];
  /** Render the default arrow before the content surface. */
  showArrow?: boolean;
}

export interface HoverCardContentSlots {
  default?: () => VNodeChild;
  arrow?: () => VNodeChild;
}

export interface HoverCardPositionerProps {
  asChild?: ArkHoverCardPositionerProps["asChild"];
}

export type HoverCardPositionerSlots = HoverCardSlots;

export interface HoverCardArrowProps {
  asChild?: ArkHoverCardArrowProps["asChild"];
}

export type HoverCardArrowSlots = HoverCardSlots;

export interface HoverCardArrowTipProps {
  asChild?: ArkHoverCardArrowTipProps["asChild"];
}

export type HoverCardArrowTipSlots = HoverCardSlots;

export interface HoverCardContextSlots {
  default?: (context: HoverCardContextValue) => VNodeChild;
}

export function resolveHoverCardPositioning(
  positioning?: HoverCardProps["positioning"],
): HoverCardPositioningOptions {
  return {
    ...HOVER_CARD_DEFAULT_POSITIONING,
    ...positioning,
  };
}
