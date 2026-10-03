<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadDropzoneProps,
  FileUploadDropzoneSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadDropzoneProps, "asChild" | "disableClick">>(), {
  asChild: undefined,
  disableClick: undefined,
});

defineSlots<FileUploadDropzoneSlots>();
</script>

<template>
  <ArkFileUpload.Dropzone
    v-bind="$attrs"
    class="kappa-file-upload__dropzone"
    data-slot="file-upload-dropzone"
    :as-child="props.asChild"
    :disable-click="props.disableClick"
  >
    <slot />
  </ArkFileUpload.Dropzone>
</template>
