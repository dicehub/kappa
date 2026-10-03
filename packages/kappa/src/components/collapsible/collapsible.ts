import type {
  CollapsibleContentProps as ArkCollapsibleContentProps,
  CollapsibleIndicatorProps as ArkCollapsibleIndicatorProps,
  CollapsibleOpenChangeDetails,
  CollapsibleRootProps as ArkCollapsibleRootProps,
  CollapsibleRootProviderProps as ArkCollapsibleRootProviderProps,
  CollapsibleTriggerProps as ArkCollapsibleTriggerProps,
  UseCollapsibleContext,
  UseCollapsibleReturn,
} from "@ark-ui/vue/collapsible";
import type { UnwrapRef, VNodeChild } from "vue";

export type { CollapsibleOpenChangeDetails } from "@ark-ui/vue/collapsible";

export type CollapsibleApi = UnwrapRef<UseCollapsibleReturn>;
export type CollapsibleContextValue = UnwrapRef<UseCollapsibleContext>;

export interface CollapsibleProps {
  asChild?: ArkCollapsibleRootProps["asChild"];
  collapsedHeight?: ArkCollapsibleRootProps["collapsedHeight"];
  collapsedWidth?: ArkCollapsibleRootProps["collapsedWidth"];
  defaultOpen?: ArkCollapsibleRootProps["defaultOpen"];
  disabled?: ArkCollapsibleRootProps["disabled"];
  id?: ArkCollapsibleRootProps["id"];
  ids?: ArkCollapsibleRootProps["ids"];
  lazyMount?: ArkCollapsibleRootProps["lazyMount"];
  open?: ArkCollapsibleRootProps["open"];
  unmountOnExit?: ArkCollapsibleRootProps["unmountOnExit"];
}

export type CollapsibleRootProps = CollapsibleProps;

export type CollapsibleEmits = {
  exitComplete: [];
  openChange: [details: CollapsibleOpenChangeDetails];
  "update:open": [open: boolean];
};

export interface CollapsibleSlots {
  default?: () => VNodeChild;
}

export type CollapsibleRootSlots = CollapsibleSlots;

export interface CollapsibleRootProviderProps {
  value: CollapsibleApi;
  asChild?: ArkCollapsibleRootProviderProps["asChild"];
}

export interface CollapsibleRootProviderSlots {
  default?: () => VNodeChild;
}

export interface CollapsibleTriggerProps {
  asChild?: ArkCollapsibleTriggerProps["asChild"];
  disabled?: ArkCollapsibleTriggerProps["disabled"];
}

export interface CollapsibleTriggerSlots {
  default?: () => VNodeChild;
  indicator?: () => VNodeChild;
}

export interface CollapsibleContentProps {
  asChild?: ArkCollapsibleContentProps["asChild"];
}

export interface CollapsibleContentSlots {
  default?: () => VNodeChild;
}

export interface CollapsibleIndicatorProps {
  asChild?: ArkCollapsibleIndicatorProps["asChild"];
}

export interface CollapsibleIndicatorSlots {
  default?: () => VNodeChild;
}

export interface CollapsibleContextSlots {
  default?: (context: CollapsibleContextValue) => VNodeChild;
}
