import type {
  CollapsibleContentProps as ArkCollapsibleContentProps,
  CollapsibleIndicatorProps as ArkCollapsibleIndicatorProps,
  CollapsibleOpenChangeDetails,
  CollapsibleRootProps as ArkCollapsibleRootProps,
  CollapsibleTriggerProps as ArkCollapsibleTriggerProps,
} from "@ark-ui/vue/collapsible";
import type { VNodeChild } from "vue";

export type { CollapsibleOpenChangeDetails as CollapsibleSectionOpenChangeDetails } from "@ark-ui/vue/collapsible";

export const COLLAPSIBLE_SECTION_SIZES = ["compact", "base"] as const;
export const COLLAPSIBLE_SECTION_DEFAULT_SIZE =
  "base" satisfies CollapsibleSectionSize;

export type CollapsibleSectionSize =
  (typeof COLLAPSIBLE_SECTION_SIZES)[number];

export const isCollapsibleSectionSize = (
  value: unknown,
): value is CollapsibleSectionSize =>
  typeof value === "string" &&
  COLLAPSIBLE_SECTION_SIZES.includes(value as CollapsibleSectionSize);

export const resolveCollapsibleSectionSize = (
  value: unknown,
): CollapsibleSectionSize =>
  isCollapsibleSectionSize(value)
    ? value
    : COLLAPSIBLE_SECTION_DEFAULT_SIZE;

export interface CollapsibleSectionProps {
  defaultOpen?: ArkCollapsibleRootProps["defaultOpen"];
  disabled?: ArkCollapsibleRootProps["disabled"];
  id?: ArkCollapsibleRootProps["id"];
  ids?: ArkCollapsibleRootProps["ids"];
  lazyMount?: ArkCollapsibleRootProps["lazyMount"];
  open?: ArkCollapsibleRootProps["open"];
  /** Controls header and content density. */
  size?: CollapsibleSectionSize;
  unmountOnExit?: ArkCollapsibleRootProps["unmountOnExit"];
}

export type CollapsibleSectionRootProps = CollapsibleSectionProps;

export type CollapsibleSectionEmits = {
  exitComplete: [];
  openChange: [details: CollapsibleOpenChangeDetails];
  "update:open": [open: boolean];
};

export interface CollapsibleSectionSlots {
  default?: () => VNodeChild;
}

export type CollapsibleSectionRootSlots = CollapsibleSectionSlots;
export type CollapsibleSectionHeaderSlots = CollapsibleSectionSlots;
export type CollapsibleSectionActionsSlots = CollapsibleSectionSlots;

export interface CollapsibleSectionTriggerProps {
  disabled?: ArkCollapsibleTriggerProps["disabled"];
}

export interface CollapsibleSectionTriggerSlots {
  default?: () => VNodeChild;
  indicator?: () => VNodeChild;
}

export type CollapsibleSectionContentProps = Pick<ArkCollapsibleContentProps, "asChild">;
export type CollapsibleSectionContentSlots = CollapsibleSectionSlots;
export type CollapsibleSectionIndicatorProps = Pick<ArkCollapsibleIndicatorProps, "asChild">;
export type CollapsibleSectionIndicatorSlots = CollapsibleSectionSlots;
