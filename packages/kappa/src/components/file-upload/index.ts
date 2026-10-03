import FileUploadRoot from "./FileUpload.vue";
import FileUploadClearTrigger from "./FileUploadClearTrigger.vue";
import FileUploadContext from "./FileUploadContext.vue";
import FileUploadDropzone from "./FileUploadDropzone.vue";
import FileUploadHiddenInput from "./FileUploadHiddenInput.vue";
import FileUploadItem from "./FileUploadItem.vue";
import FileUploadItemDeleteTrigger from "./FileUploadItemDeleteTrigger.vue";
import FileUploadItemGroup from "./FileUploadItemGroup.vue";
import FileUploadItemName from "./FileUploadItemName.vue";
import FileUploadItemPreview from "./FileUploadItemPreview.vue";
import FileUploadItemPreviewImage from "./FileUploadItemPreviewImage.vue";
import FileUploadItemSizeText from "./FileUploadItemSizeText.vue";
import FileUploadLabel from "./FileUploadLabel.vue";
import FileUploadRootProvider from "./FileUploadRootProvider.vue";
import FileUploadTrigger from "./FileUploadTrigger.vue";

export const FileUpload = Object.assign(FileUploadRoot, {
  Root: FileUploadRoot,
  RootProvider: FileUploadRootProvider,
  Label: FileUploadLabel,
  Dropzone: FileUploadDropzone,
  Trigger: FileUploadTrigger,
  HiddenInput: FileUploadHiddenInput,
  ItemGroup: FileUploadItemGroup,
  Item: FileUploadItem,
  ItemPreview: FileUploadItemPreview,
  ItemPreviewImage: FileUploadItemPreviewImage,
  ItemName: FileUploadItemName,
  ItemSizeText: FileUploadItemSizeText,
  ItemDeleteTrigger: FileUploadItemDeleteTrigger,
  ClearTrigger: FileUploadClearTrigger,
  Context: FileUploadContext,
});

export {
  FileUploadClearTrigger,
  FileUploadContext,
  FileUploadDropzone,
  FileUploadHiddenInput,
  FileUploadItem,
  FileUploadItemDeleteTrigger,
  FileUploadItemGroup,
  FileUploadItemName,
  FileUploadItemPreview,
  FileUploadItemPreviewImage,
  FileUploadItemSizeText,
  FileUploadLabel,
  FileUploadRoot,
  FileUploadRootProvider,
  FileUploadTrigger,
};

export type {
  FileUploadApi,
  FileUploadClearTriggerProps,
  FileUploadClearTriggerSlots,
  FileUploadContextSlots,
  FileUploadContextValue,
  FileUploadDropzoneProps,
  FileUploadDropzoneSlots,
  FileUploadEmits,
  FileUploadFileAcceptDetails,
  FileUploadFileChangeDetails,
  FileUploadFileError,
  FileUploadFileMimeType,
  FileUploadFileRejectDetails,
  FileUploadFileRejection,
  FileUploadHiddenInputProps,
  FileUploadItemDeleteTriggerProps,
  FileUploadItemDeleteTriggerSlots,
  FileUploadItemGroupProps,
  FileUploadItemGroupSlots,
  FileUploadItemNameProps,
  FileUploadItemNameSlots,
  FileUploadItemPreviewImageProps,
  FileUploadItemPreviewProps,
  FileUploadItemPreviewSlots,
  FileUploadItemProps,
  FileUploadItemSizeTextProps,
  FileUploadItemSizeTextSlots,
  FileUploadItemSlots,
  FileUploadLabelProps,
  FileUploadLabelSlots,
  FileUploadProps,
  FileUploadRootProps,
  FileUploadRootProviderProps,
  FileUploadRootProviderSlots,
  FileUploadRootSlots,
  FileUploadSlots,
  FileUploadTriggerProps,
  FileUploadTriggerSlots,
  UseFileUploadContext,
  UseFileUploadReturn,
} from "./file-upload";

export {
  fileUploadAnatomy,
  useFileUpload,
  useFileUploadContext,
  type UseFileUploadProps,
} from "@ark-ui/vue/file-upload";
