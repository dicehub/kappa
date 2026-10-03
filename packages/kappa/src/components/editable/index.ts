import EditableRoot from "./Editable.vue";
import EditableArea from "./EditableArea.vue";
import EditableCancelTrigger from "./EditableCancelTrigger.vue";
import EditableContext from "./EditableContext.vue";
import EditableControl from "./EditableControl.vue";
import EditableEditTrigger from "./EditableEditTrigger.vue";
import EditableInput from "./EditableInput.vue";
import EditableLabel from "./EditableLabel.vue";
import EditablePreview from "./EditablePreview.vue";
import EditableRootProvider from "./EditableRootProvider.vue";
import EditableSubmitTrigger from "./EditableSubmitTrigger.vue";

export const Editable = Object.assign(EditableRoot, {
  Root: EditableRoot,
  RootProvider: EditableRootProvider,
  Area: EditableArea,
  Label: EditableLabel,
  Preview: EditablePreview,
  Input: EditableInput,
  Control: EditableControl,
  EditTrigger: EditableEditTrigger,
  SubmitTrigger: EditableSubmitTrigger,
  CancelTrigger: EditableCancelTrigger,
  Context: EditableContext,
});

export {
  EditableArea,
  EditableCancelTrigger,
  EditableContext,
  EditableControl,
  EditableEditTrigger,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableRoot,
  EditableRootProvider,
  EditableSubmitTrigger,
};

export {
  EDITABLE_DEFAULT_SIZE,
  EDITABLE_SIZES,
  isEditableSize,
  resolveEditableSize,
  type EditableApi,
  type EditableAreaProps,
  type EditableAreaSlots,
  type EditableCancelTriggerProps,
  type EditableCancelTriggerSlots,
  type EditableContextSlots,
  type EditableContextValue,
  type EditableControlProps,
  type EditableControlSlots,
  type EditableEditChangeDetails,
  type EditableEditTriggerProps,
  type EditableEditTriggerSlots,
  type EditableEmits,
  type EditableFocusOutsideEvent,
  type EditableInputProps,
  type EditableInputSlots,
  type EditableInteractOutsideEvent,
  type EditableLabelProps,
  type EditableLabelSlots,
  type EditablePointerDownOutsideEvent,
  type EditablePreviewProps,
  type EditablePreviewSlots,
  type EditableProps,
  type EditableRootProps,
  type EditableRootProviderProps,
  type EditableRootProviderSlots,
  type EditableRootSlots,
  type EditableSize,
  type EditableSlots,
  type EditableSubmitTriggerProps,
  type EditableSubmitTriggerSlots,
  type EditableValueChangeDetails,
} from "./editable";

export {
  editableAnatomy,
  useEditable,
  useEditableContext,
  type UseEditableProps,
  type UseEditableReturn,
} from "@ark-ui/vue/editable";
