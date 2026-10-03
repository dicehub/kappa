import TooltipRoot from "./Tooltip.vue";
import TooltipArrow from "./TooltipArrow.vue";
import TooltipArrowTip from "./TooltipArrowTip.vue";
import TooltipContent from "./TooltipContent.vue";
import TooltipContext from "./TooltipContext.vue";
import TooltipRootProvider from "./TooltipRootProvider.vue";
import TooltipTrigger from "./TooltipTrigger.vue";

export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  RootProvider: TooltipRootProvider,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  ArrowTip: TooltipArrowTip,
  Context: TooltipContext,
});

export {
  TooltipArrow,
  TooltipArrowTip,
  TooltipContent,
  TooltipContext,
  TooltipRoot,
  TooltipRootProvider,
  TooltipTrigger,
};

export {
  TOOLTIP_DEFAULT_CLOSE_DELAY,
  TOOLTIP_DEFAULT_OPEN_DELAY,
  TOOLTIP_DEFAULT_POSITIONING,
} from "./tooltip";

export type {
  TooltipApi,
  TooltipArrowProps,
  TooltipArrowSlots,
  TooltipArrowTipProps,
  TooltipArrowTipSlots,
  TooltipContentProps,
  TooltipContentSlots,
  TooltipContextSlots,
  TooltipContextValue,
  TooltipEmits,
  TooltipOpenChangeDetails,
  TooltipPositioningOptions,
  TooltipProps,
  TooltipRootProps,
  TooltipRootProviderEmits,
  TooltipRootProviderProps,
  TooltipRootProviderSlots,
  TooltipRootSlots,
  TooltipSlots,
  TooltipTriggerProps,
  TooltipTriggerSlots,
  TooltipTriggerValueChangeDetails,
} from "./tooltip";

export {
  tooltipAnatomy,
  useTooltip,
  useTooltipContext,
  type UseTooltipContext,
  type UseTooltipProps,
  type UseTooltipReturn,
} from "@ark-ui/vue/tooltip";
