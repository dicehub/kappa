<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type { FileUploadHiddenInputProps } from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadHiddenInputProps, "asChild">>(), {
  asChild: undefined,
});
</script>

<template>
  <ArkFileUpload.HiddenInput
    v-bind="$attrs"
    class="kappa-file-upload__hidden-input"
    data-slot="file-upload-hidden-input"
    :as-child="props.asChild"
  />
</template>
