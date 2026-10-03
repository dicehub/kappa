import type { TextareaHTMLAttributes, VNodeChild } from "vue";
import type { FileUploadFileRejectDetails, FileUploadProps } from "../../components/file-upload";

export interface MessageComposerPayload {
  /** Exact draft text, including intentional newlines and surrounding whitespace. */
  text: string;
  /** A new array containing the selected File objects. */
  files: File[];
}

export interface MessageComposerLabels {
  label: string;
  placeholder: string;
  attach: string;
  send: string;
  sending: string;
  cancel: string;
  hint: string;
  buttonHint: string;
  attachments: string;
  characters: string;
  drop: string;
  dismissErrors: string;
  removeFile: (file: File) => string;
  rejectedFile: (file: File, reasons: string[]) => string;
  tooLong: (limit: number) => string;
  invalidFiles: string;
}

export const MESSAGE_COMPOSER_LABELS: MessageComposerLabels = {
  label: "Message", placeholder: "Write a message…", attach: "Attach files", send: "Send message",
  sending: "Sending…", cancel: "Cancel send", hint: "Enter to send · Shift+Enter for a new line",
  buttonHint: "Use the send button to submit your message.", attachments: "Attachments", characters: "Characters",
  drop: "Drop files to attach", dismissErrors: "Dismiss file errors",
  removeFile: file => `Remove ${file.name}`,
  rejectedFile: (file, reasons) => `${file.name}: ${reasons.join(" ")}`,
  tooLong: limit => `Use no more than ${limit} characters.`,
  invalidFiles: "Some attachments exceed the current file count or size limit. Remove them before sending.",
};

export interface MessageComposerProps {
  modelValue?: string;
  defaultValue?: string;
  files?: File[];
  defaultFiles?: File[];
  /** Application-controlled request state. Locks editing and shows Cancel send. */
  pending?: boolean;
  disabled?: boolean;
  /** Plain Enter sends by default. Shift+Enter always inserts a line break. */
  sendOnEnter?: boolean;
  /** Allow a draft that contains only attachments. */
  allowAttachmentsOnly?: boolean;
  /** Set false for text-only comments. */
  allowAttachments?: boolean;
  /** Ark UI file type syntax: MIME type, MIME array, or MIME-to-extension map. */
  accept?: FileUploadProps["accept"];
  maxFiles?: number;
  maxFileSize?: number;
  /** UTF-16 length, matching native textarea length semantics. */
  maxLength?: number;
  /** Application error, such as a failed send. Does not discard the draft. */
  error?: string;
  id?: string;
  labels?: Partial<MessageComposerLabels>;
  /** Native textarea attributes and listeners; core value/state/ARIA bindings win. */
  textareaProps?: TextareaHTMLAttributes;
}

export type MessageComposerEmits = {
  "update:modelValue": [value: string];
  "update:files": [files: File[]];
  send: [payload: MessageComposerPayload];
  cancel: [];
  fileReject: [details: FileUploadFileRejectDetails];
};

export interface MessageComposerApi {
  focus: () => void;
  clear: () => void;
  send: () => void;
}

export interface MessageComposerSlots {
  /** Optional reply context or destination summary, before the editor. */
  context?: () => VNodeChild;
  /** Replace the keyboard hint; other validation remains visible. */
  hint?: () => VNodeChild;
}
