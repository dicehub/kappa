import CollapsibleRoot from "./Collapsible.vue";
import CollapsibleContent from "./CollapsibleContent.vue";
import CollapsibleContext from "./CollapsibleContext.vue";
import CollapsibleIndicator from "./CollapsibleIndicator.vue";
import CollapsibleRootProvider from "./CollapsibleRootProvider.vue";
import CollapsibleTrigger from "./CollapsibleTrigger.vue";

export const Collapsible = Object.assign(CollapsibleRoot, {
  Root: CollapsibleRoot,
  RootProvider: CollapsibleRootProvider,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
  Indicator: CollapsibleIndicator,
  Context: CollapsibleContext,
});

export {
  CollapsibleContent,
  CollapsibleContext,
  CollapsibleIndicator,
  CollapsibleRoot,
  CollapsibleRootProvider,
  CollapsibleTrigger,
};

export type {
  CollapsibleApi,
  CollapsibleContentProps,
  CollapsibleContentSlots,
  CollapsibleContextSlots,
  CollapsibleContextValue,
  CollapsibleEmits,
  CollapsibleIndicatorProps,
  CollapsibleIndicatorSlots,
  CollapsibleOpenChangeDetails,
  CollapsibleProps,
  CollapsibleRootProps,
  CollapsibleRootProviderProps,
  CollapsibleRootProviderSlots,
  CollapsibleRootSlots,
  CollapsibleSlots,
  CollapsibleTriggerProps,
  CollapsibleTriggerSlots,
} from "./collapsible";

export {
  collapsibleAnatomy,
  useCollapsible,
  useCollapsibleContext,
  type UseCollapsibleProps,
  type UseCollapsibleReturn,
} from "@ark-ui/vue/collapsible";
