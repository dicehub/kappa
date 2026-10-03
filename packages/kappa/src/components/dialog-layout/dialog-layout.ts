import type { ButtonSize, ButtonType } from "../button";
import type {
  DialogContentProps,
  DialogProps,
  DialogSlots,
} from "../dialog";
import type { VNodeChild } from "vue";

export const DIALOG_LAYOUT_VERTICAL_ALIGNS = ["center", "top"] as const;
export const DIALOG_LAYOUT_PRIMARY_VARIANTS = ["primary", "destructive"] as const;

export type DialogLayoutVerticalAlign =
  (typeof DIALOG_LAYOUT_VERTICAL_ALIGNS)[number];
export type DialogLayoutPrimaryVariant =
  (typeof DIALOG_LAYOUT_PRIMARY_VARIANTS)[number];

export const DIALOG_LAYOUT_DEFAULT_VERTICAL_ALIGN =
  "center" satisfies DialogLayoutVerticalAlign;
export const DIALOG_LAYOUT_DEFAULT_PRIMARY_VARIANT =
  "primary" satisfies DialogLayoutPrimaryVariant;

const includesOwn = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === "string" && values.includes(value as T);

export const isDialogLayoutVerticalAlign = (
  value: unknown,
): value is DialogLayoutVerticalAlign =>
  includesOwn(DIALOG_LAYOUT_VERTICAL_ALIGNS, value);

export const resolveDialogLayoutVerticalAlign = (
  value: unknown,
): DialogLayoutVerticalAlign =>
  isDialogLayoutVerticalAlign(value)
    ? value
    : DIALOG_LAYOUT_DEFAULT_VERTICAL_ALIGN;

export interface DialogLayoutContentProps extends DialogContentProps {
  /** Desktop placement. Small screens always use bottom placement. */
  verticalAlign?: DialogLayoutVerticalAlign;
}

export type DialogLayoutRootProps = DialogProps;
export type DialogLayoutAlertProps = Omit<DialogProps, "role">;
export type DialogLayoutSlots = DialogSlots;
export type DialogLayoutRootSlots = DialogSlots;
export type DialogLayoutAlertSlots = DialogSlots;
export type DialogLayoutContentSlots = DialogSlots;
export type DialogLayoutHeaderSlots = DialogSlots;
export type DialogLayoutBodySlots = DialogSlots;

export interface DialogLayoutActionsProps {
  /** Label for the automatic dismiss action. Translate this value in localized products. */
  dismissLabel?: string;
  /** Disables the automatic dismiss action while work is pending. */
  dismissDisabled?: boolean;
}

export type DialogLayoutActionsSlots = DialogSlots;

export interface DialogLayoutPrimaryActionProps {
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  type?: ButtonType;
  variant?: DialogLayoutPrimaryVariant;
}

export interface DialogLayoutPrimaryActionSlots {
  default?: () => VNodeChild;
}
