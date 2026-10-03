<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadItemSizeTextProps,
  FileUploadItemSizeTextSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadItemSizeTextProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<FileUploadItemSizeTextSlots>();
</script>

<template>
  <ArkFileUpload.ItemSizeText
    v-if="$slots.default"
    v-bind="$attrs"
    class="kappa-file-upload__item-size-text"
    data-slot="file-upload-item-size-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkFileUpload.ItemSizeText>
  <ArkFileUpload.ItemSizeText
    v-else
    v-bind="$attrs"
    class="kappa-file-upload__item-size-text"
    data-slot="file-upload-item-size-text"
    :as-child="props.asChild"
  />
</template>
