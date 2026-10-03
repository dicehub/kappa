<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadItemPreviewProps,
  FileUploadItemPreviewSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadItemPreviewProps, "asChild" | "type">>(), {
  asChild: undefined,
  type: undefined,
});

defineSlots<FileUploadItemPreviewSlots>();
</script>

<template>
  <ArkFileUpload.ItemPreview
    v-bind="$attrs"
    class="kappa-file-upload__item-preview"
    data-slot="file-upload-item-preview"
    :as-child="props.asChild"
    :type="props.type"
  >
    <slot>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <path d="M4 1.75h5L12.5 5v9.25H4V1.75Z" />
        <path d="M9 1.75V5h3.5M6 8h4.5M6 10.5h3.5" />
      </svg>
    </slot>
  </ArkFileUpload.ItemPreview>
</template>
