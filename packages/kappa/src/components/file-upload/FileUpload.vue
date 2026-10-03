<script setup lang="ts">
import { FileUpload as ArkFileUpload } from "@ark-ui/vue/file-upload";
import type {
  FileUploadEmits,
  FileUploadProps,
  FileUploadRootSlots,
} from "./file-upload";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FileUploadProps>(), {
  accept: undefined,
  acceptedFiles: undefined,
  allowDrop: undefined,
  asChild: undefined,
  capture: undefined,
  defaultAcceptedFiles: undefined,
  directory: undefined,
  disabled: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  locale: undefined,
  maxFileSize: undefined,
  maxFiles: undefined,
  minFileSize: undefined,
  name: undefined,
  preventDocumentDrop: undefined,
  readOnly: undefined,
  required: undefined,
  transformFiles: undefined,
  translations: undefined,
  validate: undefined,
});

const emit = defineEmits<FileUploadEmits>();
defineSlots<FileUploadRootSlots>();
</script>

<template>
  <ArkFileUpload.Root
    v-bind="$attrs"
    class="kappa-file-upload"
    data-slot="file-upload"
    :accept="props.accept"
    :accepted-files="props.acceptedFiles"
    :allow-drop="props.allowDrop"
    :as-child="props.asChild"
    :capture="props.capture"
    :default-accepted-files="props.defaultAcceptedFiles"
    :directory="props.directory"
    :disabled="props.disabled"
    :id="props.id"
    :ids="props.ids"
    :invalid="props.invalid"
    :locale="props.locale"
    :max-file-size="props.maxFileSize"
    :max-files="props.maxFiles"
    :min-file-size="props.minFileSize"
    :name="props.name"
    :prevent-document-drop="props.preventDocumentDrop"
    :read-only="props.readOnly"
    :required="props.required"
    :transform-files="props.transformFiles"
    :translations="props.translations"
    :validate="props.validate"
    @file-accept="emit('fileAccept', $event)"
    @file-change="emit('fileChange', $event)"
    @file-reject="emit('fileReject', $event)"
    @update:accepted-files="emit('update:acceptedFiles', $event)"
  >
    <slot />
  </ArkFileUpload.Root>
</template>

<style src="./file-upload.css"></style>
