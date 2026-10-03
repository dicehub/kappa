import ToastRoot from "./Toast.vue";
import Toaster from "./Toaster.vue";
import ToastActionTrigger from "./ToastActionTrigger.vue";
import ToastCloseTrigger from "./ToastCloseTrigger.vue";
import ToastContext from "./ToastContext.vue";
import ToastDescription from "./ToastDescription.vue";
import ToastIndicator from "./ToastIndicator.vue";
import ToastTitle from "./ToastTitle.vue";

export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Indicator: ToastIndicator,
  ActionTrigger: ToastActionTrigger,
  CloseTrigger: ToastCloseTrigger,
  Context: ToastContext,
});

export { Toaster, ToastRoot, ToastTitle, ToastDescription, ToastIndicator, ToastActionTrigger, ToastCloseTrigger, ToastContext };
export {
  createToaster,
  TOAST_DEFAULT_PLACEMENT,
  TOAST_DEFAULT_MAX,
  TOAST_DEFAULT_LIMIT,
  TOAST_DEFAULT_GAP,
  TOAST_DEFAULT_DURATION,
  TOAST_DEFAULT_REMOVE_DELAY,
} from "./toast";
export type {
  CreateToasterProps,
  CreateToasterReturn,
  ToasterProps,
  ToasterSlots,
  ToastProps,
  ToastRootProps,
  ToastRootSlots,
  ToastPartProps,
  ToastPartSlots,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastIndicatorProps,
  ToastIndicatorSlots,
  ToastActionTriggerProps,
  ToastCloseTriggerProps,
  ToastContextSlots,
  ToastContextValue,
  ToastActionOptions,
  ToastOptions,
  ToastPlacement,
  ToastPromiseOptions,
  ToastStatus,
  ToastStatusChangeDetails,
  ToastStoreProps,
  ToastType,
  UseToastContext,
} from "./toast";
export { toastAnatomy, useToastContext } from "@ark-ui/vue/toast";
