<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type { FileUploadLabelProps, FileUploadLabelSlots } from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadLabelProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<FileUploadLabelSlots>();
</script>

<template>
  <ArkFileUpload.Label
    v-bind="$attrs"
    class="kappa-file-upload__label"
    data-slot="file-upload-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFileUpload.Label>
</template>
