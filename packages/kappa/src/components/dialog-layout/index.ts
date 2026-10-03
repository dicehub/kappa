import DialogClose from "../dialog/DialogClose.vue";
import DialogDescription from "../dialog/DialogDescription.vue";
import DialogRoot from "../dialog/Dialog.vue";
import DialogTitle from "../dialog/DialogTitle.vue";
import DialogTrigger from "../dialog/DialogTrigger.vue";
import DialogLayoutActionsRoot from "./DialogLayoutActions.vue";
import DialogLayoutAlert from "./DialogLayoutAlert.vue";
import DialogLayoutBody from "./DialogLayoutBody.vue";
import DialogLayoutContent from "./DialogLayoutContent.vue";
import DialogLayoutHeader from "./DialogLayoutHeader.vue";
import DialogLayoutPrimaryAction from "./DialogLayoutPrimaryAction.vue";

export const DialogLayoutActions = Object.assign(DialogLayoutActionsRoot, {
  Primary: DialogLayoutPrimaryAction,
});

export const DialogLayout = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Alert: DialogLayoutAlert,
  Trigger: DialogTrigger,
  Content: DialogLayoutContent,
  Header: DialogLayoutHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogLayoutBody,
  Actions: DialogLayoutActions,
  PrimaryAction: DialogLayoutPrimaryAction,
  Close: DialogClose,
});

export {
  DialogClose as DialogLayoutClose,
  DialogDescription as DialogLayoutDescription,
  DialogRoot as DialogLayoutRoot,
  DialogTitle as DialogLayoutTitle,
  DialogTrigger as DialogLayoutTrigger,
  DialogLayoutActionsRoot,
  DialogLayoutAlert,
  DialogLayoutBody,
  DialogLayoutContent,
  DialogLayoutHeader,
  DialogLayoutPrimaryAction,
};

export {
  DIALOG_LAYOUT_DEFAULT_PRIMARY_VARIANT,
  DIALOG_LAYOUT_DEFAULT_VERTICAL_ALIGN,
  DIALOG_LAYOUT_PRIMARY_VARIANTS,
  DIALOG_LAYOUT_VERTICAL_ALIGNS,
  isDialogLayoutVerticalAlign,
  resolveDialogLayoutVerticalAlign,
} from "./dialog-layout";

export type {
  DialogLayoutActionsProps,
  DialogLayoutActionsSlots,
  DialogLayoutAlertProps,
  DialogLayoutAlertSlots,
  DialogLayoutBodySlots,
  DialogLayoutContentProps,
  DialogLayoutContentSlots,
  DialogLayoutHeaderSlots,
  DialogLayoutPrimaryActionProps,
  DialogLayoutPrimaryActionSlots,
  DialogLayoutPrimaryVariant,
  DialogLayoutRootProps,
  DialogLayoutRootSlots,
  DialogLayoutSlots,
  DialogLayoutVerticalAlign,
} from "./dialog-layout";
