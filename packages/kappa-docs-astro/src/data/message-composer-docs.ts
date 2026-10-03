export const previewCode = `<script setup lang="ts">
import { ref } from "vue";
import { MessageComposer, type MessageComposerPayload } from "@dicehub/kappa/blocks/message-composer";

const text = ref("");
const files = ref<File[]>([]);
const messages = ref<MessageComposerPayload[]>([]);

function addMessage(payload: MessageComposerPayload) {
  messages.value.push(payload); // Local example; connect your application here.
  text.value = "";
  files.value = [];
}
</script>

<template>
  <MessageComposer v-model="text" v-model:files="files" @send="addMessage" />
</template>`;

export const examples = [
  { id: "validation", title: "Attachment and text limits", description: "File choice, paste, and drop use the same Ark UI validation. A failed file leaves accepted attachments and the text in place.",
    code: `<MessageComposer v-model="text" v-model:files="files"
  :max-length="80" :max-files="2" :max-file-size="1024"
  :accept="['text/plain', 'text/csv', 'application/pdf']"
  @send="sendMessage" @file-reject="reportRejectedFiles" />` },
  { id: "pending", title: "Pending, cancellation, and retry", description: "The application owns the pending state and request cancellation. An error or cancellation keeps the draft. Clear text and files only after success.",
    code: `<MessageComposer v-model="text" v-model:files="files"
  :pending="requestPending" :disabled="!canWrite" :error="sendError"
  @send="startRequest" @cancel="abortRequest" />` },
  { id: "comment", title: "Text-only comments", description: "Disable attachment controls and reserve Enter for newlines. The send button remains the explicit submit action.",
    code: `<MessageComposer v-model="comment" :allow-attachments="false" :send-on-enter="false"
  :labels="{ label: 'Comment', send: 'Add comment' }" @send="addComment" />` },
] as const;
