import { createToaster as createArkToaster } from "@ark-ui/vue/toast";
import type {
  CreateToasterProps as ArkCreateToasterProps,
  CreateToasterReturn,
  ToastOptions,
  ToasterBaseProps as ArkToasterBaseProps,
  UseToastContext,
} from "@ark-ui/vue/toast";
import type { TeleportProps, UnwrapRef, VNodeChild } from "vue";

export type {
  CreateToasterReturn,
  ToastActionOptions,
  ToastOptions,
  ToastPlacement,
  ToastPromiseOptions,
  ToastStatus,
  ToastStatusChangeDetails,
  ToastStoreProps,
  ToastType,
  UseToastContext,
} from "@ark-ui/vue/toast";

export const TOAST_DEFAULT_PLACEMENT = "bottom-end";
export const TOAST_DEFAULT_MAX = Infinity;
export const TOAST_DEFAULT_LIMIT = 3;
export const TOAST_DEFAULT_GAP = 8;
export const TOAST_DEFAULT_DURATION = 5000;
export const TOAST_DEFAULT_REMOVE_DELAY = 200;

export type CreateToasterProps = Partial<ArkCreateToasterProps>;

/** Create one store per application (per request for SSR), and mount it once. */
export function createToaster<T = VNodeChild>(props: CreateToasterProps = {}): CreateToasterReturn<T> {
  return createArkToaster<T>({
    ...props,
    placement: props.placement ?? TOAST_DEFAULT_PLACEMENT,
    max: props.max ?? TOAST_DEFAULT_MAX,
    overlap: props.overlap ?? true,
    gap: props.gap ?? TOAST_DEFAULT_GAP,
    duration: props.duration ?? TOAST_DEFAULT_DURATION,
    removeDelay: props.removeDelay ?? TOAST_DEFAULT_REMOVE_DELAY,
  });
}

export interface ToasterProps {
  toaster: ArkToasterBaseProps["toaster"];
  /** Show the newest notifications; older ones remain managed but inert. */
  limit?: number;
  /** Render the notification region through Teleport after mount. */
  teleport?: boolean;
  teleportTo?: TeleportProps["to"];
  /** Accessible label for the default close control. */
  closeLabel?: string;
}

export interface ToasterSlots {
  /** Replaces the complete toast, inside Ark UI's per-toast context. */
  default?: (toast: ToastOptions) => VNodeChild;
}

export interface ToastPartProps { asChild?: boolean }
export interface ToastPartSlots { default?: () => VNodeChild }
export type ToastProps = ToastPartProps;
export type ToastRootProps = ToastPartProps;
export type ToastRootSlots = ToastPartSlots;
export type ToastTitleProps = ToastPartProps;
export type ToastDescriptionProps = ToastPartProps;
export type ToastActionTriggerProps = ToastPartProps;
export type ToastCloseTriggerProps = ToastPartProps;
export type ToastContextValue = UnwrapRef<UseToastContext>;
export interface ToastContextSlots { default?: (toast: ToastContextValue) => VNodeChild }

export interface ToastIndicatorProps {}
export interface ToastIndicatorSlots { default?: (toast: ToastContextValue) => VNodeChild }
