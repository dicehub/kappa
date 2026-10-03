interface ComposerKey {
  key: string;
  isComposing?: boolean;
  keyCode?: number;
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  repeat?: boolean;
  defaultPrevented?: boolean;
}

export function messageComposerKeyAction(event: ComposerKey, sendOnEnter: boolean, composing: boolean) {
  if (!sendOnEnter || composing || event.isComposing || event.keyCode === 229 || event.defaultPrevented ||
    event.key !== "Enter" || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return "native";
  return event.repeat ? "suppress" : "send";
}

export function resolveMessageComposerLimit(value: unknown, fallback: number, minimum = 1): number {
  return typeof value === "number" && Number.isFinite(value) && value >= minimum ? Math.floor(value) : fallback;
}

export function isMessageComposerDraftValid(options: {
  text: string; files: readonly { size: number }[]; maxLength: number; maxFiles: number;
  maxFileSize: number; allowAttachmentsOnly: boolean; allowAttachments: boolean;
}) {
  return options.text.length <= options.maxLength && options.files.length <= options.maxFiles &&
    options.files.every(file => Number.isFinite(file.size) && file.size >= 0 && file.size <= options.maxFileSize) &&
    (options.allowAttachments || options.files.length === 0) &&
    (options.text.trim().length > 0 || (options.allowAttachmentsOnly && options.files.length > 0));
}

const rejectionReasons: Record<string, string> = {
  FILE_INVALID_TYPE: "This file type is not allowed.", FILE_TOO_LARGE: "The file is too large.",
  FILE_TOO_SMALL: "The file is too small.", FILE_EXISTS: "This file is already attached.",
  TOO_MANY_FILES: "The file count limit was reached.",
};
export function messageComposerRejectionReason(code: string) { return rejectionReasons[code] ?? "The file cannot be attached."; }
