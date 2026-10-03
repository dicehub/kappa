<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type { FileUploadContextSlots } from "./file-upload";

defineSlots<FileUploadContextSlots>();
</script>

<template>
  <ArkFileUpload.Context v-slot="context">
    <slot v-bind="context" />
  </ArkFileUpload.Context>
</template>
