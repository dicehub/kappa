import type { VNodeChild } from "vue";

export const ATTACHMENT_STATES = [
  "idle",
  "uploading",
  "processing",
  "error",
  "done",
] as const;

export const ATTACHMENT_SIZES = ["default", "sm", "xs"] as const;
export const ATTACHMENT_ORIENTATIONS = ["horizontal", "vertical"] as const;
export const ATTACHMENT_MEDIA_VARIANTS = ["icon", "image"] as const;
export const ATTACHMENT_BUTTON_TYPES = ["button", "submit", "reset"] as const;
export const ATTACHMENT_TRIGGER_ELEMENTS = ["button", "a"] as const;

export type AttachmentState = (typeof ATTACHMENT_STATES)[number];
export type AttachmentSize = (typeof ATTACHMENT_SIZES)[number];
export type AttachmentOrientation = (typeof ATTACHMENT_ORIENTATIONS)[number];
export type AttachmentMediaVariant = (typeof ATTACHMENT_MEDIA_VARIANTS)[number];
export type AttachmentButtonType = (typeof ATTACHMENT_BUTTON_TYPES)[number];
export type AttachmentTriggerElement = (typeof ATTACHMENT_TRIGGER_ELEMENTS)[number];

export const ATTACHMENT_DEFAULT_STATE = "done" satisfies AttachmentState;
export const ATTACHMENT_DEFAULT_SIZE = "default" satisfies AttachmentSize;
export const ATTACHMENT_DEFAULT_ORIENTATION =
  "horizontal" satisfies AttachmentOrientation;
export const ATTACHMENT_MEDIA_DEFAULT_VARIANT = "icon" satisfies AttachmentMediaVariant;
export const ATTACHMENT_ACTION_DEFAULT_TYPE = "button" satisfies AttachmentButtonType;
export const ATTACHMENT_TRIGGER_DEFAULT_ELEMENT = "button" satisfies AttachmentTriggerElement;
export const ATTACHMENT_TRIGGER_DEFAULT_TYPE = "button" satisfies AttachmentButtonType;

export interface AttachmentRootProps {
  /** Layout direction for the media, copy, and actions. */
  orientation?: AttachmentOrientation;
  /** Density of the attachment card. */
  size?: AttachmentSize;
  /** Consumer-controlled file or upload state. */
  state?: AttachmentState;
}

export type AttachmentProps = AttachmentRootProps;

export interface AttachmentMediaProps {
  /** Displays compact icon media or a cropped image preview. */
  variant?: AttachmentMediaVariant;
}

export interface AttachmentActionProps {
  /** Prevents activation using native button semantics. */
  disabled?: boolean;
  /** Native button type. Defaults to `button` to avoid accidental form submission. */
  type?: AttachmentButtonType;
}

export interface AttachmentTriggerProps {
  /** Native interactive element used for the full-card trigger. */
  as?: AttachmentTriggerElement;
  /** Native button type. Ignored when `as` is `a`. */
  type?: AttachmentButtonType;
}

export interface AttachmentRootSlots {
  default?: () => VNodeChild;
}

export type AttachmentSlots = AttachmentRootSlots;

export interface AttachmentMediaSlots {
  default?: () => VNodeChild;
}

export interface AttachmentContentSlots {
  default?: () => VNodeChild;
}

export interface AttachmentTitleSlots {
  default?: () => VNodeChild;
}

export interface AttachmentDescriptionSlots {
  default?: () => VNodeChild;
}

export interface AttachmentActionsSlots {
  default?: () => VNodeChild;
}

export interface AttachmentActionSlots {
  default?: () => VNodeChild;
}

export interface AttachmentTriggerSlots {
  default?: () => VNodeChild;
}

export interface AttachmentGroupSlots {
  default?: () => VNodeChild;
}

const includes = <Value extends string>(
  values: readonly Value[],
  value: unknown,
): value is Value => typeof value === "string" && values.includes(value as Value);

export const isAttachmentState = (value: unknown): value is AttachmentState =>
  includes(ATTACHMENT_STATES, value);

export const isAttachmentSize = (value: unknown): value is AttachmentSize =>
  includes(ATTACHMENT_SIZES, value);

export const isAttachmentOrientation = (value: unknown): value is AttachmentOrientation =>
  includes(ATTACHMENT_ORIENTATIONS, value);

export const isAttachmentMediaVariant = (value: unknown): value is AttachmentMediaVariant =>
  includes(ATTACHMENT_MEDIA_VARIANTS, value);

export const isAttachmentButtonType = (value: unknown): value is AttachmentButtonType =>
  includes(ATTACHMENT_BUTTON_TYPES, value);

export const isAttachmentTriggerElement = (
  value: unknown,
): value is AttachmentTriggerElement => includes(ATTACHMENT_TRIGGER_ELEMENTS, value);

export const resolveAttachmentState = (value: unknown): AttachmentState =>
  isAttachmentState(value) ? value : ATTACHMENT_DEFAULT_STATE;

export const resolveAttachmentSize = (value: unknown): AttachmentSize =>
  isAttachmentSize(value) ? value : ATTACHMENT_DEFAULT_SIZE;

export const resolveAttachmentOrientation = (value: unknown): AttachmentOrientation =>
  isAttachmentOrientation(value) ? value : ATTACHMENT_DEFAULT_ORIENTATION;

export const resolveAttachmentMediaVariant = (value: unknown): AttachmentMediaVariant =>
  isAttachmentMediaVariant(value) ? value : ATTACHMENT_MEDIA_DEFAULT_VARIANT;

export const resolveAttachmentButtonType = (value: unknown): AttachmentButtonType =>
  isAttachmentButtonType(value) ? value : ATTACHMENT_ACTION_DEFAULT_TYPE;

export const resolveAttachmentTriggerElement = (value: unknown): AttachmentTriggerElement =>
  isAttachmentTriggerElement(value) ? value : ATTACHMENT_TRIGGER_DEFAULT_ELEMENT;
