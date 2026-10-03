import type {
  EditableEditChangeDetails,
  EditableFocusOutsideEvent,
  EditableInteractOutsideEvent,
  EditablePointerDownOutsideEvent,
  EditableRootProps as ArkEditableRootProps,
  EditableValueChangeDetails,
  UseEditableContext,
  UseEditableReturn,
} from "@ark-ui/vue/editable";
import type { UnwrapRef, VNodeChild } from "vue";

export const EDITABLE_SIZES = ["xs", "sm", "default", "lg"] as const;
export const EDITABLE_DEFAULT_SIZE = "default" as const;

export type EditableSize = (typeof EDITABLE_SIZES)[number];
export type EditableApi = UnwrapRef<UseEditableReturn>;
export type EditableContextValue = UnwrapRef<UseEditableContext>;

export const isEditableSize = (value: unknown): value is EditableSize =>
  typeof value === "string" && EDITABLE_SIZES.includes(value as EditableSize);

export const resolveEditableSize = (value: unknown): EditableSize =>
  isEditableSize(value) ? value : EDITABLE_DEFAULT_SIZE;

export interface EditableProps {
  activationMode?: ArkEditableRootProps["activationMode"];
  asChild?: ArkEditableRootProps["asChild"];
  autoResize?: ArkEditableRootProps["autoResize"];
  defaultEdit?: ArkEditableRootProps["defaultEdit"];
  defaultValue?: ArkEditableRootProps["defaultValue"];
  disabled?: ArkEditableRootProps["disabled"];
  edit?: ArkEditableRootProps["edit"];
  finalFocusEl?: ArkEditableRootProps["finalFocusEl"];
  form?: ArkEditableRootProps["form"];
  id?: ArkEditableRootProps["id"];
  ids?: ArkEditableRootProps["ids"];
  invalid?: ArkEditableRootProps["invalid"];
  maxLength?: ArkEditableRootProps["maxLength"];
  modelValue?: ArkEditableRootProps["modelValue"];
  name?: ArkEditableRootProps["name"];
  placeholder?: ArkEditableRootProps["placeholder"];
  readOnly?: ArkEditableRootProps["readOnly"];
  required?: ArkEditableRootProps["required"];
  selectOnFocus?: ArkEditableRootProps["selectOnFocus"];
  /** Field height: xs 20px, sm 28px, default 36px, lg 40px at a 16px root font size. */
  size?: EditableSize;
  submitMode?: ArkEditableRootProps["submitMode"];
  translations?: ArkEditableRootProps["translations"];
}

export type EditableRootProps = EditableProps;

export type EditableEmits = {
  editChange: [details: EditableEditChangeDetails];
  focusOutside: [event: EditableFocusOutsideEvent];
  interactOutside: [event: EditableInteractOutsideEvent];
  pointerDownOutside: [event: EditablePointerDownOutsideEvent];
  valueChange: [details: EditableValueChangeDetails];
  valueCommit: [details: EditableValueChangeDetails];
  valueRevert: [details: EditableValueChangeDetails];
  "update:edit": [edit: boolean];
  "update:modelValue": [value: string];
};

export interface EditableSlots {
  default?: () => VNodeChild;
}

export type EditableRootSlots = EditableSlots;

export interface EditableRootProviderProps {
  value: EditableApi;
  asChild?: boolean;
  size?: EditableSize;
}

export interface EditableRootProviderSlots {
  default?: () => VNodeChild;
}

export interface EditablePartProps {
  asChild?: boolean;
}

export type EditableAreaProps = EditablePartProps;
export type EditableLabelProps = EditablePartProps;
export type EditablePreviewProps = EditablePartProps;
export type EditableInputProps = EditablePartProps;
export type EditableControlProps = EditablePartProps;
export type EditableEditTriggerProps = EditablePartProps;
export type EditableSubmitTriggerProps = EditablePartProps;
export type EditableCancelTriggerProps = EditablePartProps;

export interface EditablePartSlots {
  default?: () => VNodeChild;
}

export type EditableAreaSlots = EditablePartSlots;
export type EditableLabelSlots = EditablePartSlots;
export type EditablePreviewSlots = EditablePartSlots;
export type EditableInputSlots = EditablePartSlots;
export type EditableControlSlots = EditablePartSlots;
export type EditableEditTriggerSlots = EditablePartSlots;
export type EditableSubmitTriggerSlots = EditablePartSlots;
export type EditableCancelTriggerSlots = EditablePartSlots;

export interface EditableContextSlots {
  default?: (context: EditableContextValue) => VNodeChild;
}

export type {
  EditableEditChangeDetails,
  EditableFocusOutsideEvent,
  EditableInteractOutsideEvent,
  EditablePointerDownOutsideEvent,
  EditableValueChangeDetails,
  UseEditableContext,
  UseEditableReturn,
} from "@ark-ui/vue/editable";
