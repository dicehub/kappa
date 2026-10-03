import AttachmentRoot from "./Attachment.vue";
import AttachmentAction from "./AttachmentAction.vue";
import AttachmentActions from "./AttachmentActions.vue";
import AttachmentContent from "./AttachmentContent.vue";
import AttachmentDescription from "./AttachmentDescription.vue";
import AttachmentGroup from "./AttachmentGroup.vue";
import AttachmentMedia from "./AttachmentMedia.vue";
import AttachmentTitle from "./AttachmentTitle.vue";
import AttachmentTrigger from "./AttachmentTrigger.vue";

export const Attachment = Object.assign(AttachmentRoot, {
  Root: AttachmentRoot,
  Media: AttachmentMedia,
  Content: AttachmentContent,
  Title: AttachmentTitle,
  Description: AttachmentDescription,
  Actions: AttachmentActions,
  Action: AttachmentAction,
  Trigger: AttachmentTrigger,
  Group: AttachmentGroup,
});

export {
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentRoot,
  AttachmentTitle,
  AttachmentTrigger,
};

export {
  ATTACHMENT_ACTION_DEFAULT_TYPE,
  ATTACHMENT_BUTTON_TYPES,
  ATTACHMENT_DEFAULT_ORIENTATION,
  ATTACHMENT_DEFAULT_SIZE,
  ATTACHMENT_DEFAULT_STATE,
  ATTACHMENT_MEDIA_DEFAULT_VARIANT,
  ATTACHMENT_MEDIA_VARIANTS,
  ATTACHMENT_ORIENTATIONS,
  ATTACHMENT_SIZES,
  ATTACHMENT_STATES,
  ATTACHMENT_TRIGGER_DEFAULT_ELEMENT,
  ATTACHMENT_TRIGGER_DEFAULT_TYPE,
  ATTACHMENT_TRIGGER_ELEMENTS,
  isAttachmentButtonType,
  isAttachmentMediaVariant,
  isAttachmentOrientation,
  isAttachmentSize,
  isAttachmentState,
  isAttachmentTriggerElement,
  resolveAttachmentButtonType,
  resolveAttachmentMediaVariant,
  resolveAttachmentOrientation,
  resolveAttachmentSize,
  resolveAttachmentState,
  resolveAttachmentTriggerElement,
  type AttachmentActionProps,
  type AttachmentActionSlots,
  type AttachmentActionsSlots,
  type AttachmentButtonType,
  type AttachmentContentSlots,
  type AttachmentDescriptionSlots,
  type AttachmentGroupSlots,
  type AttachmentMediaProps,
  type AttachmentMediaSlots,
  type AttachmentMediaVariant,
  type AttachmentOrientation,
  type AttachmentProps,
  type AttachmentRootProps,
  type AttachmentRootSlots,
  type AttachmentSize,
  type AttachmentSlots,
  type AttachmentState,
  type AttachmentTitleSlots,
  type AttachmentTriggerElement,
  type AttachmentTriggerProps,
  type AttachmentTriggerSlots,
} from "./attachment";
