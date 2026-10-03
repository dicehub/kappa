<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadRootProviderProps,
  FileUploadRootProviderSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<FileUploadRootProviderProps, "asChild" | "value">>(), {
  asChild: undefined,
});

defineSlots<FileUploadRootProviderSlots>();
</script>

<template>
  <ArkFileUpload.RootProvider
    v-bind="$attrs"
    class="kappa-file-upload"
    data-slot="file-upload"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkFileUpload.RootProvider>
</template>

<style src="./file-upload.css"></style>
