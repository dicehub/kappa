import type { ClipboardCopyStatusDetails } from "@ark-ui/vue/clipboard";
import type { VNodeChild } from "vue";
import type { TextSize } from "../text";

export type InlineCopyTextVariant = "body" | "secondary" | "mono" | "mono-secondary";
export type InlineCopyTextSize = TextSize;

export interface InlineCopyTextProps {
  /** Exact text to copy. Also displayed when the default slot is empty. */
  value: string;
  /** Accessible action prefix and tooltip text. The visible text remains in the name. */
  copyLabel?: string;
  /** Tooltip and live announcement during copied feedback. */
  copiedLabel?: string;
  /** Prevents copying and removes the button from the tab order. */
  disabled?: boolean;
  /** Keeps the icon visible without hover or focus. Touch devices always show it. */
  iconVisibility?: "hover" | "always";
  /** Text color and font family. */
  variant?: InlineCopyTextVariant;
  /** Text size, including monospace text. */
  size?: InlineCopyTextSize;
  /** Uses the medium text weight. */
  bold?: boolean;
  /** Clips long display text to one line without changing the copied value. */
  truncate?: boolean;
  /** Duration of Ark UI's copied feedback, in milliseconds. */
  timeout?: number;
}

export type InlineCopyTextEmits = {
  statusChange: [details: ClipboardCopyStatusDetails];
};

export interface InlineCopyTextSlots {
  /** Custom display text. Use phrasing content without links or other controls. */
  default?: () => VNodeChild;
}
