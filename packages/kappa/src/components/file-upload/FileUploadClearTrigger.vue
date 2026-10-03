<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadClearTriggerProps,
  FileUploadClearTriggerSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadClearTriggerProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<FileUploadClearTriggerSlots>();
</script>

<template>
  <ArkFileUpload.ClearTrigger
    v-bind="$attrs"
    class="kappa-file-upload__clear-trigger"
    data-slot="file-upload-clear-trigger"
    :as-child="props.asChild"
  >
    <slot>Clear files</slot>
  </ArkFileUpload.ClearTrigger>
</template>
