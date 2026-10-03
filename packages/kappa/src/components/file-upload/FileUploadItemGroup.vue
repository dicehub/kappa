<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadItemGroupProps,
  FileUploadItemGroupSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadItemGroupProps, "asChild" | "type">>(), {
  asChild: undefined,
  type: undefined,
});

defineSlots<FileUploadItemGroupSlots>();
</script>

<template>
  <ArkFileUpload.ItemGroup
    v-bind="$attrs"
    class="kappa-file-upload__item-group"
    data-slot="file-upload-item-group"
    :as-child="props.asChild"
    :type="props.type"
  >
    <slot />
  </ArkFileUpload.ItemGroup>
</template>
