<script setup lang="ts">
import { FileUpload } from "@dicehub/kappa/components/file-upload";
import { Progress } from "@dicehub/kappa/components/progress";

const props = withDefaults(
  defineProps<{
    busy?: boolean;
    files: File[];
    progress?: Record<string, number>;
  }>(),
  {
    busy: false,
    progress: () => ({}),
  },
);

const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;
</script>

<template>
  <FileUpload.ItemGroup>
    <FileUpload.Item v-for="file in props.files" :key="fileKey(file)" :file="file">
      <FileUpload.ItemPreview />
      <FileUpload.ItemName />
      <FileUpload.ItemSizeText />
      <FileUpload.ItemDeleteTrigger
        :aria-label="`Remove ${file.name}`"
        :disabled="props.busy"
      />
      <Progress.Root
        v-if="props.progress[fileKey(file)] !== undefined"
        class="file-upload-file-list__progress"
        :model-value="props.progress[fileKey(file)]"
        :aria-label="`Upload progress for ${file.name}`"
      >
        <Progress.Label>
          {{ props.progress[fileKey(file)] === 100 ? "Uploaded" : "Uploading" }}
        </Progress.Label>
        <Progress.ValueText />
        <Progress.Track><Progress.Range /></Progress.Track>
      </Progress.Root>
    </FileUpload.Item>
  </FileUpload.ItemGroup>
</template>

<style scoped>
.file-upload-file-list__progress {
  grid-column: 2 / -1;
  grid-row: 3;
  margin-block-start: 0.375rem;
}

.file-upload-file-list__progress :deep(.kappa-progress__label),
.file-upload-file-list__progress :deep(.kappa-progress__value-text) {
  font-size: 0.6875rem;
  line-height: 0.875rem;
}

.file-upload-file-list__progress :deep(.kappa-progress__track) {
  --kappa-progress-track-size: 0.25rem;
}
</style>
