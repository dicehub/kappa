import DialogRoot from "./Dialog.vue";
import DialogBackdrop from "./DialogBackdrop.vue";
import DialogClose from "./DialogClose.vue";
import DialogContent from "./DialogContent.vue";
import DialogContext from "./DialogContext.vue";
import DialogDescription from "./DialogDescription.vue";
import DialogFooter from "./DialogFooter.vue";
import DialogHeader from "./DialogHeader.vue";
import DialogPositioner from "./DialogPositioner.vue";
import DialogRootProvider from "./DialogRootProvider.vue";
import DialogTitle from "./DialogTitle.vue";
import DialogTrigger from "./DialogTrigger.vue";

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  RootProvider: DialogRootProvider,
  Trigger: DialogTrigger,
  Backdrop: DialogBackdrop,
  Positioner: DialogPositioner,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: DialogClose,
  CloseTrigger: DialogClose,
  Context: DialogContext,
});

export {
  DialogBackdrop,
  DialogClose,
  DialogClose as DialogCloseTrigger,
  DialogContent,
  DialogContext,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogRootProvider,
  DialogTitle,
  DialogTrigger,
};

export {
  DIALOG_DEFAULT_ROLE,
  DIALOG_DEFAULT_SIZE,
  DIALOG_ROLES,
  DIALOG_SIZES,
  isDialogRole,
  isDialogSize,
  resolveDialogRole,
  resolveDialogSize,
} from "./dialog";

export type {
  DialogApi,
  DialogBackdropProps,
  DialogBackdropSlots,
  DialogCloseProps,
  DialogCloseSlots,
  DialogCloseTriggerProps,
  DialogCloseTriggerSlots,
  DialogContentProps,
  DialogContentSlots,
  DialogContextSlots,
  DialogContextValue,
  DialogDescriptionProps,
  DialogDescriptionSlots,
  DialogEmits,
  DialogFooterSlots,
  DialogHeaderSlots,
  DialogProps,
  DialogRequestDismissEvent,
  DialogRole,
  DialogRootProps,
  DialogRootProviderEmits,
  DialogRootProviderProps,
  DialogRootProviderSlots,
  DialogRootSlots,
  DialogSize,
  DialogSlots,
  DialogTitleProps,
  DialogTitleSlots,
  DialogTriggerProps,
  DialogTriggerSlots,
} from "./dialog";

export {
  dialogAnatomy,
  useDialog,
  useDialogContext,
  type UseDialogProps,
  type UseDialogReturn,
} from "@ark-ui/vue/dialog";
