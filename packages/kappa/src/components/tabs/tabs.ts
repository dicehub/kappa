import type {
  TabContentProps as ArkTabsContentProps,
  TabIndicatorProps as ArkTabsIndicatorProps,
  TabListProps as ArkTabsListProps,
  TabTriggerProps as ArkTabsTriggerProps,
  TabsContextProps as ArkTabsContextProps,
  TabsFocusChangeDetails,
  TabsRootProps as ArkTabsRootProps,
  TabsRootProviderProps as ArkTabsRootProviderProps,
  TabsValueChangeDetails,
  UseTabsContext,
  UseTabsReturn,
} from "@ark-ui/vue/tabs";
import type { UnwrapRef, VNodeChild } from "vue";

export type TabsDirection = "ltr" | "rtl";
export type TabsOrientation = NonNullable<ArkTabsRootProps["orientation"]>;
export type TabsActivationMode = NonNullable<ArkTabsRootProps["activationMode"]>;
export type TabsApi = UnwrapRef<UseTabsReturn>;
export type TabsContextValue = UnwrapRef<UseTabsContext>;

export const TABS_VARIANTS = ["segmented", "line"] as const;
export const TABS_SIZES = ["sm", "base"] as const;

export type TabsVariant = (typeof TABS_VARIANTS)[number];
export type TabsSize = (typeof TABS_SIZES)[number];

export const TABS_DEFAULT_VARIANT = "segmented" satisfies TabsVariant;
export const TABS_DEFAULT_SIZE = "base" satisfies TabsSize;

export const isTabsVariant = (value: unknown): value is TabsVariant =>
  typeof value === "string" && TABS_VARIANTS.includes(value as TabsVariant);

export const isTabsSize = (value: unknown): value is TabsSize =>
  typeof value === "string" && TABS_SIZES.includes(value as TabsSize);

export const resolveTabsVariant = (value: unknown): TabsVariant =>
  isTabsVariant(value) ? value : TABS_DEFAULT_VARIANT;

export const resolveTabsSize = (value: unknown): TabsSize =>
  isTabsSize(value) ? value : TABS_DEFAULT_SIZE;

export interface TabsProps {
  activationMode?: ArkTabsRootProps["activationMode"];
  asChild?: ArkTabsRootProps["asChild"];
  composite?: ArkTabsRootProps["composite"];
  defaultValue?: ArkTabsRootProps["defaultValue"];
  /** Overrides the inherited Ark UI locale direction. */
  dir?: TabsDirection;
  deselectable?: ArkTabsRootProps["deselectable"];
  id?: ArkTabsRootProps["id"];
  ids?: ArkTabsRootProps["ids"];
  lazyMount?: ArkTabsRootProps["lazyMount"];
  loopFocus?: ArkTabsRootProps["loopFocus"];
  modelValue?: ArkTabsRootProps["modelValue"];
  navigate?: ArkTabsRootProps["navigate"];
  orientation?: ArkTabsRootProps["orientation"];
  translations?: ArkTabsRootProps["translations"];
  unmountOnExit?: ArkTabsRootProps["unmountOnExit"];
}

export type TabsRootProps = TabsProps;

export type TabsEmits = {
  focusChange: [details: TabsFocusChangeDetails];
  valueChange: [details: TabsValueChangeDetails];
  "update:modelValue": [value: string];
};

export interface TabsSlots {
  default?: () => VNodeChild;
}

export type TabsRootSlots = TabsSlots;

export interface TabsRootProviderProps {
  value: TabsApi;
  asChild?: ArkTabsRootProviderProps["asChild"];
  lazyMount?: ArkTabsRootProviderProps["lazyMount"];
  unmountOnExit?: ArkTabsRootProviderProps["unmountOnExit"];
}

export type TabsRootProviderSlots = TabsSlots;

export interface TabsListProps {
  asChild?: ArkTabsListProps["asChild"];
  /** Visual treatment for the selection rail. */
  variant?: TabsVariant;
  /** Compact or default tab geometry. */
  size?: TabsSize;
}
export type TabsTriggerProps = ArkTabsTriggerProps;
export type TabsContentProps = ArkTabsContentProps;
export type TabsIndicatorProps = ArkTabsIndicatorProps;
export type TabsContextProps = ArkTabsContextProps;

export interface TabsPartSlots {
  default?: () => VNodeChild;
}

export type TabsListSlots = TabsPartSlots;
export type TabsTriggerSlots = TabsPartSlots;
export type TabsContentSlots = TabsPartSlots;
export type TabsIndicatorSlots = TabsPartSlots;

export interface TabsContextSlots {
  default?: (context: TabsContextValue) => VNodeChild;
}

export type {
  TabsFocusChangeDetails,
  TabsValueChangeDetails,
  UseTabsContext,
  UseTabsReturn,
};
