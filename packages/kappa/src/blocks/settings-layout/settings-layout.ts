import type { CollapsibleRootProps, CollapsibleOpenChangeDetails } from "@ark-ui/vue/collapsible";
import type { VNodeChild } from "vue";

export interface SettingsLayoutProps {
  title?: string;
  description?: string;
}

export interface SettingsLayoutSlots {
  title?: () => VNodeChild;
  description?: () => VNodeChild;
  actions?: () => VNodeChild;
  navigation?: () => VNodeChild;
  default?: () => VNodeChild;
}

export interface SettingsSectionProps {
  title: string;
  description?: string;
  headingLevel?: 2 | 3 | 4;
  collapsible?: boolean;
  defaultOpen?: CollapsibleRootProps["defaultOpen"];
  open?: CollapsibleRootProps["open"];
  disabled?: CollapsibleRootProps["disabled"];
  id?: CollapsibleRootProps["id"];
  ids?: CollapsibleRootProps["ids"];
  lazyMount?: CollapsibleRootProps["lazyMount"];
  unmountOnExit?: CollapsibleRootProps["unmountOnExit"];
  expandLabel?: string;
  closeLabel?: string;
}

export type SettingsSectionEmits = {
  "update:open": [open: boolean];
  openChange: [details: CollapsibleOpenChangeDetails];
  exitComplete: [];
};

export interface SettingsSectionContext {
  open: boolean;
}

export interface SettingsSectionSlots {
  title?: (context: SettingsSectionContext) => VNodeChild;
  description?: (context: SettingsSectionContext) => VNodeChild;
  actions?: (context: SettingsSectionContext) => VNodeChild;
  default?: (context: SettingsSectionContext) => VNodeChild;
}
