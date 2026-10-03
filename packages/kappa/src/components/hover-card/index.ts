import HoverCardRoot from "./HoverCard.vue";
import HoverCardArrow from "./HoverCardArrow.vue";
import HoverCardArrowTip from "./HoverCardArrowTip.vue";
import HoverCardContent from "./HoverCardContent.vue";
import HoverCardContext from "./HoverCardContext.vue";
import HoverCardPositioner from "./HoverCardPositioner.vue";
import HoverCardRootProvider from "./HoverCardRootProvider.vue";
import HoverCardTrigger from "./HoverCardTrigger.vue";

export const HoverCard = Object.assign(HoverCardRoot, {
  Root: HoverCardRoot,
  RootProvider: HoverCardRootProvider,
  Trigger: HoverCardTrigger,
  Positioner: HoverCardPositioner,
  Content: HoverCardContent,
  Arrow: HoverCardArrow,
  ArrowTip: HoverCardArrowTip,
  Context: HoverCardContext,
});

export {
  HoverCardArrow,
  HoverCardArrowTip,
  HoverCardContent,
  HoverCardContext,
  HoverCardPositioner,
  HoverCardRoot,
  HoverCardRootProvider,
  HoverCardTrigger,
};

export {
  HOVER_CARD_DEFAULT_CLOSE_DELAY,
  HOVER_CARD_DEFAULT_OPEN_DELAY,
  HOVER_CARD_DEFAULT_POSITIONING,
  resolveHoverCardPositioning,
} from "./hover-card";

export type {
  HoverCardApi,
  HoverCardArrowProps,
  HoverCardArrowSlots,
  HoverCardArrowTipProps,
  HoverCardArrowTipSlots,
  HoverCardContentProps,
  HoverCardContentSlots,
  HoverCardContextSlots,
  HoverCardContextValue,
  HoverCardEmits,
  HoverCardFocusOutsideEvent,
  HoverCardInteractOutsideEvent,
  HoverCardOpenChangeDetails,
  HoverCardPointerDownOutsideEvent,
  HoverCardPositionerProps,
  HoverCardPositionerSlots,
  HoverCardPositioningOptions,
  HoverCardProps,
  HoverCardRootProps,
  HoverCardRootProviderEmits,
  HoverCardRootProviderProps,
  HoverCardRootProviderSlots,
  HoverCardRootSlots,
  HoverCardSlots,
  HoverCardTriggerProps,
  HoverCardTriggerSlots,
  HoverCardTriggerValueChangeDetails,
} from "./hover-card";

export {
  hoverCardAnatomy,
  useHoverCard,
  useHoverCardContext,
  type UseHoverCardContext,
  type UseHoverCardProps,
  type UseHoverCardReturn,
} from "@ark-ui/vue/hover-card";
