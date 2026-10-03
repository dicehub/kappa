import type {
  DialogBackdropProps as ArkDialogBackdropProps,
  DialogCloseTriggerProps as ArkDialogCloseTriggerProps,
  DialogDescriptionProps as ArkDialogDescriptionProps,
  DialogFocusOutsideEvent,
  DialogInteractOutsideEvent,
  DialogOpenChangeDetails,
  DialogPointerDownOutsideEvent,
  DialogPositionerProps as ArkDialogPositionerProps,
  DialogRootProps as ArkDialogRootProps,
  DialogRootProviderProps as ArkDialogRootProviderProps,
  DialogTitleProps as ArkDialogTitleProps,
  DialogTriggerProps as ArkDialogTriggerProps,
  DialogTriggerValueChangeDetails,
  UseDialogContext,
  UseDialogReturn,
} from "@ark-ui/vue/dialog";
import type { TeleportProps, UnwrapRef, VNodeChild } from "vue";

export type {
  DialogFocusOutsideEvent,
  DialogInteractOutsideEvent,
  DialogOpenChangeDetails,
  DialogPointerDownOutsideEvent,
  DialogTriggerValueChangeDetails,
} from "@ark-ui/vue/dialog";

export const DIALOG_SIZES = ["sm", "base", "lg", "xl"] as const;
export const DIALOG_ROLES = ["dialog", "alertdialog"] as const;

export type DialogSize = (typeof DIALOG_SIZES)[number];
export type DialogRole = (typeof DIALOG_ROLES)[number];

export const DIALOG_DEFAULT_SIZE = "base" satisfies DialogSize;
export const DIALOG_DEFAULT_ROLE = "dialog" satisfies DialogRole;

const includesOwn = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === "string" && values.includes(value as T);

export const isDialogSize = (value: unknown): value is DialogSize =>
  includesOwn(DIALOG_SIZES, value);

export const isDialogRole = (value: unknown): value is DialogRole =>
  includesOwn(DIALOG_ROLES, value);

export const resolveDialogSize = (value: unknown): DialogSize =>
  isDialogSize(value) ? value : DIALOG_DEFAULT_SIZE;

export const resolveDialogRole = (value: unknown): DialogRole =>
  isDialogRole(value) ? value : DIALOG_DEFAULT_ROLE;

export type DialogApi = UnwrapRef<UseDialogReturn>;
export type DialogContextValue = UnwrapRef<UseDialogContext>;

export type DialogRequestDismissEvent = CustomEvent<{
  originalIndex: number;
  originalLayer: HTMLElement;
  targetIndex: number;
  targetLayer: HTMLElement | undefined;
}>;

export interface DialogProps {
  ariaLabel?: ArkDialogRootProps["aria-label"];
  closeOnEscape?: ArkDialogRootProps["closeOnEscape"];
  closeOnInteractOutside?: ArkDialogRootProps["closeOnInteractOutside"];
  defaultOpen?: ArkDialogRootProps["defaultOpen"];
  defaultTriggerValue?: ArkDialogRootProps["defaultTriggerValue"];
  /** Prevents pointer dismissal. Alert dialogs enable this behavior by default. */
  disablePointerDismissal?: boolean;
  finalFocusEl?: ArkDialogRootProps["finalFocusEl"];
  id?: ArkDialogRootProps["id"];
  ids?: ArkDialogRootProps["ids"];
  initialFocusEl?: ArkDialogRootProps["initialFocusEl"];
  lazyMount?: ArkDialogRootProps["lazyMount"];
  modal?: ArkDialogRootProps["modal"];
  open?: ArkDialogRootProps["open"];
  persistentElements?: ArkDialogRootProps["persistentElements"];
  preventScroll?: ArkDialogRootProps["preventScroll"];
  restoreFocus?: ArkDialogRootProps["restoreFocus"];
  role?: DialogRole;
  trapFocus?: ArkDialogRootProps["trapFocus"];
  triggerValue?: ArkDialogRootProps["triggerValue"];
  unmountOnExit?: ArkDialogRootProps["unmountOnExit"];
}

export type DialogRootProps = DialogProps;

export type DialogEmits = {
  escapeKeyDown: [event: KeyboardEvent];
  exitComplete: [];
  focusOutside: [event: DialogFocusOutsideEvent];
  interactOutside: [event: DialogInteractOutsideEvent];
  openChange: [details: DialogOpenChangeDetails];
  pointerDownOutside: [event: DialogPointerDownOutsideEvent];
  requestDismiss: [event: DialogRequestDismissEvent];
  triggerValueChange: [details: DialogTriggerValueChangeDetails];
  "update:open": [open: boolean];
  "update:triggerValue": [triggerValue: string | null];
};

export interface DialogSlots {
  default?: () => VNodeChild;
}

export type DialogRootSlots = DialogSlots;

export interface DialogRootProviderProps {
  value: DialogApi;
  lazyMount?: ArkDialogRootProviderProps["lazyMount"];
  unmountOnExit?: ArkDialogRootProviderProps["unmountOnExit"];
}

export type DialogRootProviderEmits = {
  exitComplete: [];
};

export type DialogRootProviderSlots = DialogSlots;

export interface DialogTriggerProps {
  asChild?: ArkDialogTriggerProps["asChild"];
  value?: ArkDialogTriggerProps["value"];
}

export type DialogTriggerSlots = DialogSlots;

export interface DialogBackdropProps {
  asChild?: ArkDialogBackdropProps["asChild"];
}

export type DialogBackdropSlots = DialogSlots;

export interface DialogPositionerProps {
  asChild?: ArkDialogPositionerProps["asChild"];
}

export type DialogPositionerSlots = DialogSlots;

export interface DialogContentProps {
  /** Accessible label for the built-in close control. */
  closeLabel?: string;
  /** Renders the modal backdrop. Disable this for non-modal dialogs. */
  showBackdrop?: boolean;
  /** Renders the built-in close control. */
  showCloseButton?: boolean;
  size?: DialogSize;
  /** Teleports the backdrop and content. */
  teleport?: boolean;
  teleportTo?: TeleportProps["to"];
}

export interface DialogContentSlots {
  default?: () => VNodeChild;
  /** Replaces the built-in close control. Include Dialog.Close in this slot. */
  close?: () => VNodeChild;
}

export interface DialogCloseProps {
  asChild?: ArkDialogCloseTriggerProps["asChild"];
  /** Accessible label used by the built-in icon control. */
  label?: string;
}

export type DialogCloseSlots = DialogSlots;
export type DialogCloseTriggerProps = DialogCloseProps;
export type DialogCloseTriggerSlots = DialogCloseSlots;

export interface DialogTitleProps {
  asChild?: ArkDialogTitleProps["asChild"];
}

export type DialogTitleSlots = DialogSlots;

export interface DialogDescriptionProps {
  asChild?: ArkDialogDescriptionProps["asChild"];
}

export type DialogDescriptionSlots = DialogSlots;
export type DialogHeaderSlots = DialogSlots;
export type DialogFooterSlots = DialogSlots;

export interface DialogContextSlots {
  default?: (context: DialogContextValue) => VNodeChild;
}
