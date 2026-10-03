<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadTriggerProps,
  FileUploadTriggerSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadTriggerProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<FileUploadTriggerSlots>();
</script>

<template>
  <ArkFileUpload.Trigger
    v-bind="$attrs"
    class="kappa-file-upload__trigger"
    data-slot="file-upload-trigger"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFileUpload.Trigger>
</template>
