import type { CollapsibleOpenChangeDetails } from "@ark-ui/vue/collapsible";
import type { VNodeChild } from "vue";

export const EXPANDABLE_TEXT_DEFAULT_LINES = 3;
export const EXPANDABLE_TEXT_DEFAULT_EXPAND_LABEL = "Show more";
export const EXPANDABLE_TEXT_DEFAULT_COLLAPSE_LABEL = "Show less";

export interface ExpandableTextProps {
  /** Number of visible text lines while the content is collapsed. */
  lines?: number;
  /** Initial state when the component is uncontrolled. */
  defaultOpen?: boolean;
  /** Controlled expanded state. */
  open?: boolean;
  /** Prevents the disclosure button from changing the expanded state. */
  disabled?: boolean;
  /** Stable identifier used to connect the disclosure button and content. */
  id?: string;
  /** Visible and accessible label used while content is collapsed. */
  expandLabel?: string;
  /** Visible and accessible label used while content is expanded. */
  collapseLabel?: string;
}

export type ExpandableTextEmits = {
  openChange: [details: CollapsibleOpenChangeDetails];
  "update:open": [open: boolean];
};

export interface ExpandableTextTriggerSlotProps {
  open: boolean;
  label: string;
}

export interface ExpandableTextSlots {
  default?: () => VNodeChild;
  trigger?: (props: ExpandableTextTriggerSlotProps) => VNodeChild;
}

export const resolveExpandableTextLines = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1) {
    return EXPANDABLE_TEXT_DEFAULT_LINES;
  }

  return Math.floor(value);
};
