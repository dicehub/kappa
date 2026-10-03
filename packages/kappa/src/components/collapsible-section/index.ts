import CollapsibleSectionRoot from "./CollapsibleSection.vue";
import CollapsibleSectionActions from "./CollapsibleSectionActions.vue";
import CollapsibleSectionContent from "./CollapsibleSectionContent.vue";
import CollapsibleSectionHeader from "./CollapsibleSectionHeader.vue";
import CollapsibleSectionIndicator from "./CollapsibleSectionIndicator.vue";
import CollapsibleSectionTrigger from "./CollapsibleSectionTrigger.vue";

export const CollapsibleSection = Object.assign(CollapsibleSectionRoot, {
  Root: CollapsibleSectionRoot,
  Header: CollapsibleSectionHeader,
  Trigger: CollapsibleSectionTrigger,
  Indicator: CollapsibleSectionIndicator,
  Actions: CollapsibleSectionActions,
  Content: CollapsibleSectionContent,
});

export {
  CollapsibleSectionActions,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionIndicator,
  CollapsibleSectionRoot,
  CollapsibleSectionTrigger,
};

export type {
  CollapsibleSectionActionsSlots,
  CollapsibleSectionContentProps,
  CollapsibleSectionContentSlots,
  CollapsibleSectionEmits,
  CollapsibleSectionHeaderSlots,
  CollapsibleSectionIndicatorProps,
  CollapsibleSectionIndicatorSlots,
  CollapsibleSectionOpenChangeDetails,
  CollapsibleSectionProps,
  CollapsibleSectionRootProps,
  CollapsibleSectionRootSlots,
  CollapsibleSectionSize,
  CollapsibleSectionSlots,
  CollapsibleSectionTriggerProps,
  CollapsibleSectionTriggerSlots,
} from "./collapsible-section";

export {
  COLLAPSIBLE_SECTION_DEFAULT_SIZE,
  COLLAPSIBLE_SECTION_SIZES,
  isCollapsibleSectionSize,
  resolveCollapsibleSectionSize,
} from "./collapsible-section";
