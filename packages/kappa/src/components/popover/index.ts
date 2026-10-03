import PopoverRoot from "./Popover.vue";
import PopoverAnchor from "./PopoverAnchor.vue";
import PopoverArrow from "./PopoverArrow.vue";
import PopoverArrowTip from "./PopoverArrowTip.vue";
import PopoverCloseTrigger from "./PopoverCloseTrigger.vue";
import PopoverContent from "./PopoverContent.vue";
import PopoverContext from "./PopoverContext.vue";
import PopoverDescription from "./PopoverDescription.vue";
import PopoverIndicator from "./PopoverIndicator.vue";
import PopoverPositioner from "./PopoverPositioner.vue";
import PopoverRootProvider from "./PopoverRootProvider.vue";
import PopoverTitle from "./PopoverTitle.vue";
import PopoverTrigger from "./PopoverTrigger.vue";

export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  RootProvider: PopoverRootProvider,
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Positioner: PopoverPositioner,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  ArrowTip: PopoverArrowTip,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Indicator: PopoverIndicator,
  Close: PopoverCloseTrigger,
  CloseTrigger: PopoverCloseTrigger,
  Context: PopoverContext,
});

export {
  PopoverAnchor,
  PopoverArrow,
  PopoverArrowTip,
  PopoverCloseTrigger,
  PopoverCloseTrigger as PopoverClose,
  PopoverContent,
  PopoverContext,
  PopoverDescription,
  PopoverIndicator,
  PopoverPositioner,
  PopoverRoot,
  PopoverRootProvider,
  PopoverTitle,
  PopoverTrigger,
};

export { POPOVER_DEFAULT_POSITIONING } from "./popover";

export type {
  PopoverAnchorProps,
  PopoverAnchorSlots,
  PopoverApi,
  PopoverArrowProps,
  PopoverArrowSlots,
  PopoverArrowTipProps,
  PopoverArrowTipSlots,
  PopoverCloseProps,
  PopoverCloseSlots,
  PopoverCloseTriggerProps,
  PopoverCloseTriggerSlots,
  PopoverContentProps,
  PopoverContentSlots,
  PopoverContextSlots,
  PopoverContextValue,
  PopoverDescriptionProps,
  PopoverDescriptionSlots,
  PopoverDirection,
  PopoverEmits,
  PopoverFocusOutsideEvent,
  PopoverInteractOutsideEvent,
  PopoverIndicatorProps,
  PopoverIndicatorSlots,
  PopoverOpenChangeDetails,
  PopoverPointerDownOutsideEvent,
  PopoverPositionerProps,
  PopoverPositionerSlots,
  PopoverPositioningOptions,
  PopoverProps,
  PopoverRequestDismissEvent,
  PopoverRootProps,
  PopoverRootProviderEmits,
  PopoverRootProviderProps,
  PopoverRootProviderSlots,
  PopoverRootSlots,
  PopoverSlots,
  PopoverTitleProps,
  PopoverTitleSlots,
  PopoverTriggerProps,
  PopoverTriggerSlots,
  PopoverTriggerValueChangeDetails,
} from "./popover";

export {
  popoverAnatomy,
  usePopover,
  usePopoverContext,
  type UsePopoverContext,
  type UsePopoverProps,
  type UsePopoverReturn,
} from "@ark-ui/vue/popover";
