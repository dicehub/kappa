import type { VNodeChild } from "vue";
import type { DialogOpenChangeDetails, DialogProps } from "../../components/dialog/dialog";

export interface DeleteResourceProps {
  /** Name of the resource being removed. */
  resourceName: string;
  /** Controlled dialog visibility. The consumer closes it after successful deletion. */
  open?: boolean;
  /** Initial visibility when open is not controlled. */
  defaultOpen?: boolean;
  /** Requires an exact, case-sensitive resource-name match before confirmation. */
  requireName?: boolean;
  /** Blocks confirmation, cancellation, and Escape while a request is pending. */
  deleting?: boolean;
  /** Disables confirmation, for example when the resource cannot be removed. */
  disabled?: boolean;
  /** Request failure shown in an announced error banner. Does not block retry. */
  error?: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  deletingLabel?: string;
  cancelLabel?: string;
  confirmationLabel?: string;
  /** Focus destination on close, useful for programmatically opened dialogs. */
  finalFocusEl?: DialogProps["finalFocusEl"];
}

export type DeleteResourceEmits = {
  /** Requests deletion. No network call or automatic close is performed. */
  confirm: [];
  openChange: [details: DialogOpenChangeDetails];
  "update:open": [open: boolean];
};

export interface DeleteResourceSlots {
  /** One button. Wrapped in Dialog.Trigger with asChild. */
  trigger?: () => VNodeChild;
  /** Optional context or consequences below the resource name. */
  default?: () => VNodeChild;
}

export const DELETE_RESOURCE_DEFAULTS = {
  title: "Delete resource?",
  description: "This action cannot be undone.",
  confirmLabel: "Delete resource",
  deletingLabel: "Deleting…",
  cancelLabel: "Cancel",
  confirmationLabel: "Type the resource name to confirm",
} as const;
