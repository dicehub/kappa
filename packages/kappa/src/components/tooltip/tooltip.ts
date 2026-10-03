import type {
  TooltipArrowProps as ArkTooltipArrowProps,
  TooltipArrowTipProps as ArkTooltipArrowTipProps,
  TooltipContentProps as ArkTooltipContentProps,
  TooltipOpenChangeDetails,
  TooltipRootProps as ArkTooltipRootProps,
  TooltipRootProviderProps as ArkTooltipRootProviderProps,
  TooltipTriggerProps as ArkTooltipTriggerProps,
  TooltipTriggerValueChangeDetails,
  UseTooltipContext,
  UseTooltipReturn,
} from "@ark-ui/vue/tooltip";
import type { TeleportProps, UnwrapRef, VNodeChild } from "vue";

export type {
  TooltipOpenChangeDetails,
  TooltipTriggerValueChangeDetails,
} from "@ark-ui/vue/tooltip";

export type TooltipPositioningOptions = NonNullable<ArkTooltipRootProps["positioning"]>;
export type TooltipApi = UnwrapRef<UseTooltipReturn>;
export type TooltipContextValue = UnwrapRef<UseTooltipContext>;

export const TOOLTIP_DEFAULT_OPEN_DELAY = 400;
export const TOOLTIP_DEFAULT_CLOSE_DELAY = 150;
export const TOOLTIP_DEFAULT_POSITIONING = {
  fitViewport: true,
  gutter: 8,
  overflowPadding: 12,
  placement: "top",
} as const satisfies TooltipPositioningOptions;

export interface TooltipProps {
  ariaLabel?: ArkTooltipRootProps["aria-label"];
  closeDelay?: ArkTooltipRootProps["closeDelay"];
  closeOnClick?: ArkTooltipRootProps["closeOnClick"];
  closeOnEscape?: ArkTooltipRootProps["closeOnEscape"];
  closeOnPointerDown?: ArkTooltipRootProps["closeOnPointerDown"];
  closeOnScroll?: ArkTooltipRootProps["closeOnScroll"];
  defaultOpen?: ArkTooltipRootProps["defaultOpen"];
  defaultTriggerValue?: ArkTooltipRootProps["defaultTriggerValue"];
  disabled?: ArkTooltipRootProps["disabled"];
  id?: ArkTooltipRootProps["id"];
  ids?: ArkTooltipRootProps["ids"];
  interactive?: ArkTooltipRootProps["interactive"];
  lazyMount?: ArkTooltipRootProps["lazyMount"];
  open?: ArkTooltipRootProps["open"];
  openDelay?: ArkTooltipRootProps["openDelay"];
  positioning?: ArkTooltipRootProps["positioning"];
  triggerValue?: ArkTooltipRootProps["triggerValue"];
  unmountOnExit?: ArkTooltipRootProps["unmountOnExit"];
}

export type TooltipRootProps = TooltipProps;

export type TooltipEmits = {
  exitComplete: [];
  openChange: [details: TooltipOpenChangeDetails];
  triggerValueChange: [details: TooltipTriggerValueChangeDetails];
  "update:open": [open: boolean];
  "update:triggerValue": [triggerValue: string | null];
};

export interface TooltipSlots {
  default?: () => VNodeChild;
}

export type TooltipRootSlots = TooltipSlots;

export interface TooltipRootProviderProps {
  value: TooltipApi;
  lazyMount?: ArkTooltipRootProviderProps["lazyMount"];
  unmountOnExit?: ArkTooltipRootProviderProps["unmountOnExit"];
}

export type TooltipRootProviderEmits = { exitComplete: [] };
export type TooltipRootProviderSlots = TooltipSlots;

export interface TooltipTriggerProps {
  asChild?: ArkTooltipTriggerProps["asChild"];
  value?: ArkTooltipTriggerProps["value"];
}

export type TooltipTriggerSlots = TooltipSlots;

export interface TooltipContentProps {
  asChild?: ArkTooltipContentProps["asChild"];
  /** Keep the popup in the component DOM tree when false. */
  teleport?: boolean;
  /** Target for the popup teleport. */
  teleportTo?: TeleportProps["to"];
  /** Render the default arrow before the content surface. */
  showArrow?: boolean;
}

export interface TooltipContentSlots {
  default?: () => VNodeChild;
  arrow?: () => VNodeChild;
}

export interface TooltipArrowProps {
  asChild?: ArkTooltipArrowProps["asChild"];
}

export type TooltipArrowSlots = TooltipSlots;

export interface TooltipArrowTipProps {
  asChild?: ArkTooltipArrowTipProps["asChild"];
}

export type TooltipArrowTipSlots = TooltipSlots;

export interface TooltipContextSlots {
  default?: (context: TooltipContextValue) => VNodeChild;
}
