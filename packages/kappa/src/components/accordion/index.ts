import AccordionRoot from "./Accordion.vue";
import AccordionContent from "./AccordionContent.vue";
import AccordionIndicator from "./AccordionIndicator.vue";
import AccordionItem from "./AccordionItem.vue";
import AccordionTrigger from "./AccordionTrigger.vue";

export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
  Indicator: AccordionIndicator,
});

export {
  AccordionContent,
  AccordionIndicator,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
};

export type {
  AccordionContentSlots,
  AccordionDirection,
  AccordionEmits,
  AccordionIndicatorSlots,
  AccordionItemProps,
  AccordionItemSlots,
  AccordionOrientation,
  AccordionProps,
  AccordionRootProps,
  AccordionSlots,
  AccordionTriggerSlots,
} from "./accordion";

export type {
  AccordionFocusChangeDetails,
  AccordionValueChangeDetails,
} from "@ark-ui/vue/accordion";
