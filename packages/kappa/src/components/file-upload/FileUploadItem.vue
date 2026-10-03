<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type { FileUploadItemProps, FileUploadItemSlots } from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadItemProps, "asChild" | "file">>(), {
  asChild: undefined,
});

defineSlots<FileUploadItemSlots>();
</script>

<template>
  <ArkFileUpload.Item
    v-bind="$attrs"
    class="kappa-file-upload__item"
    data-slot="file-upload-item"
    :as-child="props.asChild"
    :file="props.file"
  >
    <slot />
  </ArkFileUpload.Item>
</template>
