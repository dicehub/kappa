import TabsRoot from "./Tabs.vue";
import TabsContent from "./TabsContent.vue";
import TabsContext from "./TabsContext.vue";
import TabsIndicator from "./TabsIndicator.vue";
import TabsList from "./TabsList.vue";
import TabsRootProvider from "./TabsRootProvider.vue";
import TabsTrigger from "./TabsTrigger.vue";

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  RootProvider: TabsRootProvider,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator,
  Context: TabsContext,
});

export {
  TabsContent,
  TabsContext,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsRootProvider,
  TabsTrigger,
};

export type {
  TabsActivationMode,
  TabsApi,
  TabsContentProps,
  TabsContentSlots,
  TabsContextProps,
  TabsContextSlots,
  TabsContextValue,
  TabsDirection,
  TabsEmits,
  TabsFocusChangeDetails,
  TabsIndicatorProps,
  TabsIndicatorSlots,
  TabsListProps,
  TabsListSlots,
  TabsOrientation,
  TabsProps,
  TabsRootProps,
  TabsRootProviderProps,
  TabsRootProviderSlots,
  TabsRootSlots,
  TabsSlots,
  TabsSize,
  TabsTriggerProps,
  TabsTriggerSlots,
  TabsVariant,
  TabsValueChangeDetails,
  UseTabsContext,
  UseTabsReturn,
} from "./tabs";

export {
  TABS_DEFAULT_SIZE,
  TABS_DEFAULT_VARIANT,
  TABS_SIZES,
  TABS_VARIANTS,
  isTabsSize,
  isTabsVariant,
  resolveTabsSize,
  resolveTabsVariant,
} from "./tabs";

export {
  tabsAnatomy,
  useTabs,
  useTabsContext,
  type UseTabsProps,
} from "@ark-ui/vue/tabs";
