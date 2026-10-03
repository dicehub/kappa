<script setup lang="ts">
import { Attachment } from "../../components/attachment";
import type { MessageComposerLabels } from "./message-composer";
defineProps<{ files: File[]; disabled: boolean; labels: MessageComposerLabels; formatSize: (file: File) => string }>();
defineEmits<{ remove: [file: File] }>();
</script>

<template>
  <ul class="kappa-message-composer__attachments" :aria-label="labels.attachments">
    <li v-for="(file, index) in files" :key="`${file.name}-${file.size}-${file.lastModified}-${index}`">
      <Attachment size="xs" class="kappa-message-composer__attachment">
        <Attachment.Media aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none"><path d="M11.5 2.5H5.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-10l-4-4Zm0 0v4h4M7 10h6M7 13h4" /></svg>
        </Attachment.Media>
        <Attachment.Content><Attachment.Title :title="file.name">{{ file.name }}</Attachment.Title><Attachment.Description>{{ formatSize(file) }}</Attachment.Description></Attachment.Content>
        <Attachment.Actions><Attachment.Action :disabled="disabled" :aria-label="labels.removeFile(file)" @click="$emit('remove', file)">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
        </Attachment.Action></Attachment.Actions>
      </Attachment>
    </li>
  </ul>
</template>
