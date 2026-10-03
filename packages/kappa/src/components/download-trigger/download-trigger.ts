import type {
  DownloadableData,
  UseDownloadProps,
  UseDownloadReturn,
} from "@ark-ui/vue/download-trigger";
import type { Component, VNodeChild } from "vue";
import type {
  ButtonIconPosition,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
  ButtonVisualProps,
} from "../button";

export type { DownloadableData, UseDownloadProps, UseDownloadReturn } from "@ark-ui/vue/download-trigger";

export interface DownloadTriggerProps extends ButtonVisualProps {
  /** Merge download behavior and styling onto one direct child element. */
  asChild?: boolean;
  /** String, Blob, File, or producer resolved when the user activates the trigger. */
  data: UseDownloadProps["data"];
  /** Prevents the native button from starting a download. */
  disabled?: boolean;
  /** Suggested file name, including its extension. */
  fileName: string;
  /** Shows a busy indicator and prevents activation while data is prepared externally. */
  loading?: boolean;
  /** MIME type assigned to generated string data. */
  mimeType: UseDownloadProps["mimeType"];
}

export interface DownloadTriggerSlots {
  /** Button content, or one complete child element when asChild is enabled. */
  default?: () => VNodeChild;
}

export interface DownloadTriggerVisualContract {
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
  icon?: Component;
  iconPosition: ButtonIconPosition;
}
