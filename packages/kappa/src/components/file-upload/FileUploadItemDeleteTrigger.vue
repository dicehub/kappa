<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadItemDeleteTriggerProps,
  FileUploadItemDeleteTriggerSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadItemDeleteTriggerProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<FileUploadItemDeleteTriggerSlots>();
</script>

<template>
  <ArkFileUpload.ItemDeleteTrigger
    v-bind="$attrs"
    class="kappa-file-upload__item-delete-trigger"
    data-slot="file-upload-item-delete-trigger"
    :as-child="props.asChild"
  >
    <slot>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <path d="m4.5 4.5 7 7m0-7-7 7" />
      </svg>
    </slot>
  </ArkFileUpload.ItemDeleteTrigger>
</template>
