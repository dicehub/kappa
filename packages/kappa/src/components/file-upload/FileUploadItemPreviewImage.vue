<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type { FileUploadItemPreviewImageProps } from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadItemPreviewImageProps, "asChild">>(), {
  asChild: undefined,
});
</script>

<template>
  <ArkFileUpload.ItemPreviewImage
    v-bind="$attrs"
    class="kappa-file-upload__item-preview-image"
    data-slot="file-upload-item-preview-image"
    :as-child="props.asChild"
  />
</template>
