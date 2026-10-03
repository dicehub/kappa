import type {
  FileUploadClearTriggerProps as ArkFileUploadClearTriggerProps,
  FileUploadDropzoneProps as ArkFileUploadDropzoneProps,
  FileUploadFileAcceptDetails,
  FileUploadFileChangeDetails,
  FileUploadFileError,
  FileUploadFileMimeType,
  FileUploadFileRejectDetails,
  FileUploadFileRejection,
  FileUploadHiddenInputProps as ArkFileUploadHiddenInputProps,
  FileUploadItemDeleteTriggerProps as ArkFileUploadItemDeleteTriggerProps,
  FileUploadItemGroupProps as ArkFileUploadItemGroupProps,
  FileUploadItemNameProps as ArkFileUploadItemNameProps,
  FileUploadItemPreviewImageProps as ArkFileUploadItemPreviewImageProps,
  FileUploadItemPreviewProps as ArkFileUploadItemPreviewProps,
  FileUploadItemProps as ArkFileUploadItemProps,
  FileUploadItemSizeTextProps as ArkFileUploadItemSizeTextProps,
  FileUploadLabelProps as ArkFileUploadLabelProps,
  FileUploadRootProps as ArkFileUploadRootProps,
  FileUploadRootProviderProps as ArkFileUploadRootProviderProps,
  FileUploadTriggerProps as ArkFileUploadTriggerProps,
  UseFileUploadContext,
  UseFileUploadReturn,
} from "@ark-ui/vue/file-upload";
import type { UnwrapRef, VNodeChild } from "vue";

export type {
  FileUploadFileAcceptDetails,
  FileUploadFileChangeDetails,
  FileUploadFileError,
  FileUploadFileMimeType,
  FileUploadFileRejectDetails,
  FileUploadFileRejection,
};

export type FileUploadApi = UnwrapRef<UseFileUploadReturn>;
export type FileUploadContextValue = UnwrapRef<UseFileUploadContext>;

export interface FileUploadProps {
  accept?: ArkFileUploadRootProps["accept"];
  acceptedFiles?: ArkFileUploadRootProps["acceptedFiles"];
  allowDrop?: ArkFileUploadRootProps["allowDrop"];
  asChild?: ArkFileUploadRootProps["asChild"];
  capture?: ArkFileUploadRootProps["capture"];
  defaultAcceptedFiles?: ArkFileUploadRootProps["defaultAcceptedFiles"];
  directory?: ArkFileUploadRootProps["directory"];
  disabled?: ArkFileUploadRootProps["disabled"];
  id?: ArkFileUploadRootProps["id"];
  ids?: ArkFileUploadRootProps["ids"];
  invalid?: ArkFileUploadRootProps["invalid"];
  locale?: ArkFileUploadRootProps["locale"];
  maxFileSize?: ArkFileUploadRootProps["maxFileSize"];
  maxFiles?: ArkFileUploadRootProps["maxFiles"];
  minFileSize?: ArkFileUploadRootProps["minFileSize"];
  name?: ArkFileUploadRootProps["name"];
  preventDocumentDrop?: ArkFileUploadRootProps["preventDocumentDrop"];
  readOnly?: ArkFileUploadRootProps["readOnly"];
  required?: ArkFileUploadRootProps["required"];
  transformFiles?: ArkFileUploadRootProps["transformFiles"];
  translations?: ArkFileUploadRootProps["translations"];
  validate?: ArkFileUploadRootProps["validate"];
}

export type FileUploadRootProps = FileUploadProps;

export type FileUploadEmits = {
  fileAccept: [details: FileUploadFileAcceptDetails];
  fileChange: [details: FileUploadFileChangeDetails];
  fileReject: [details: FileUploadFileRejectDetails];
  "update:acceptedFiles": [files: File[]];
};

export interface FileUploadSlots {
  default?: () => VNodeChild;
}

export type FileUploadRootSlots = FileUploadSlots;
export type FileUploadRootProviderProps = Omit<
  ArkFileUploadRootProviderProps,
  "value"
> & {
  value: FileUploadApi;
};
export type FileUploadRootProviderSlots = FileUploadSlots;
export type FileUploadLabelProps = ArkFileUploadLabelProps;
export type FileUploadLabelSlots = FileUploadSlots;
export type FileUploadDropzoneProps = ArkFileUploadDropzoneProps;
export type FileUploadDropzoneSlots = FileUploadSlots;
export type FileUploadTriggerProps = ArkFileUploadTriggerProps;
export type FileUploadTriggerSlots = FileUploadSlots;
export type FileUploadHiddenInputProps = ArkFileUploadHiddenInputProps;
export type FileUploadItemGroupProps = ArkFileUploadItemGroupProps;
export type FileUploadItemGroupSlots = FileUploadSlots;
export type FileUploadItemProps = ArkFileUploadItemProps;
export type FileUploadItemSlots = FileUploadSlots;
export type FileUploadItemPreviewProps = ArkFileUploadItemPreviewProps;
export type FileUploadItemPreviewSlots = FileUploadSlots;
export type FileUploadItemPreviewImageProps = ArkFileUploadItemPreviewImageProps;
export type FileUploadItemNameProps = ArkFileUploadItemNameProps;
export type FileUploadItemNameSlots = FileUploadSlots;
export type FileUploadItemSizeTextProps = ArkFileUploadItemSizeTextProps;
export type FileUploadItemSizeTextSlots = FileUploadSlots;
export type FileUploadItemDeleteTriggerProps = ArkFileUploadItemDeleteTriggerProps;
export type FileUploadItemDeleteTriggerSlots = FileUploadSlots;
export type FileUploadClearTriggerProps = ArkFileUploadClearTriggerProps;
export type FileUploadClearTriggerSlots = FileUploadSlots;

export interface FileUploadContextSlots {
  default?: (context: FileUploadContextValue) => VNodeChild;
}

export type { UseFileUploadContext, UseFileUploadReturn };
