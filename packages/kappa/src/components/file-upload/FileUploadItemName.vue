<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadItemNameProps,
  FileUploadItemNameSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadItemNameProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<FileUploadItemNameSlots>();
</script>

<template>
  <ArkFileUpload.ItemName
    v-if="$slots.default"
    v-bind="$attrs"
    class="kappa-file-upload__item-name"
    data-slot="file-upload-item-name"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFileUpload.ItemName>
  <ArkFileUpload.ItemName
    v-else
    v-bind="$attrs"
    class="kappa-file-upload__item-name"
    data-slot="file-upload-item-name"
    :as-child="props.asChild"
  />
</template>
