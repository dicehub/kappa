<script setup lang="ts">
import { ref } from "vue";
import { MessageComposer, type MessageComposerPayload } from "@dicehub/kappa/blocks/message-composer";
import { Button } from "@dicehub/kappa/components/button";

const props = withDefaults(defineProps<{ variant?: "preview" | "validation" | "pending" | "comment"; standalone?: boolean }>(), {
  variant: "preview", standalone: false,
});
const text = ref("");
const files = ref<File[]>([]);
const pending = ref(false);
const disabled = ref(false);
const error = ref("");
const status = ref("");
const queued = ref<MessageComposerPayload>();
const messages = ref<{ id: number; text: string; files: string[] }[]>([]);
let nextId = 0;

function append(payload: MessageComposerPayload) {
  messages.value.push({ id: ++nextId, text: payload.text, files: payload.files.map(file => file.name) });
  text.value = ""; files.value = []; error.value = "";
  status.value = "Message added to this local example.";
}
function send(payload: MessageComposerPayload) {
  error.value = "";
  if (props.variant === "pending") {
    queued.value = payload; pending.value = true; status.value = "The example request is pending.";
  } else append(payload);
}
function cancel() {
  pending.value = false; queued.value = undefined; status.value = "Send canceled. Your draft is kept.";
}
function finish(succeeded: boolean) {
  if (succeeded && queued.value) append(queued.value);
  else { error.value = "The message could not be sent. Your draft is kept. Try again."; status.value = ""; }
  pending.value = false; queued.value = undefined;
}
</script>

<template>
  <section class="message-composer-demo" :class="{ 'message-composer-demo--standalone': standalone }" :data-message-composer-demo="variant">
    <header v-if="variant === 'preview'" class="message-composer-demo__header">
      <div><span class="message-composer-demo__eyebrow">Project update</span><h2>Design review</h2></div>
      <span class="message-composer-demo__participants">3 participants</span>
    </header>
    <div class="message-composer-demo__thread" role="log" aria-label="Example conversation" aria-live="polite">
      <template v-if="variant === 'preview'">
        <article class="message-composer-demo__message"><span class="message-composer-demo__avatar" aria-hidden="true">MC</span><div><header><strong>Maya Chen</strong><span>09:41</span></header><p>The updated design is ready for review. I added the release notes to the shared document.</p></div></article>
        <article class="message-composer-demo__message"><span class="message-composer-demo__avatar message-composer-demo__avatar--accent" aria-hidden="true">JL</span><div><header><strong>Jonas Lee</strong><span>09:48</span></header><p>The layout looks good. Add the final image before we approve the release.</p></div></article>
      </template>
      <article v-for="message in messages" :key="message.id" class="message-composer-demo__message" data-sent-message>
        <span class="message-composer-demo__avatar" aria-hidden="true">YO</span><div><header><strong>You</strong><span>Just now</span></header><p v-if="message.text">{{ message.text }}</p><ul v-if="message.files.length"><li v-for="file in message.files" :key="file">{{ file }}</li></ul></div>
      </article>
    </div>
    <div class="message-composer-demo__compose">
      <div v-if="variant === 'pending'" class="message-composer-demo__state-controls">
        <Button size="sm" variant="outline" :aria-pressed="disabled" @click="disabled = !disabled">{{ disabled ? 'Enable composer' : 'Disable composer' }}</Button>
        <template v-if="pending"><Button size="sm" variant="secondary" @click="finish(true)">Complete send</Button><Button size="sm" variant="ghost" @click="finish(false)">Simulate send error</Button></template>
      </div>
      <MessageComposer v-model="text" v-model:files="files" :pending="pending" :disabled="disabled" :error="error"
        :max-length="variant === 'validation' ? 80 : 4000" :max-files="variant === 'validation' ? 2 : 5"
        :max-file-size="variant === 'validation' ? 1024 : 10 * 1024 * 1024"
        :accept="variant === 'validation' ? ['text/plain', 'text/csv', 'application/pdf'] : undefined"
        :allow-attachments="variant !== 'comment'" :send-on-enter="variant !== 'comment'"
        :labels="variant === 'comment' ? { label: 'Comment', send: 'Add comment', placeholder: 'Add a note for the next reviewer…' } : { label: 'Message', placeholder: 'Share an update or attach a result…' }"
        @send="send" @cancel="cancel">
        <template v-if="variant === 'preview'" #context>Replying in <strong>Design review</strong> · release-notes-v3</template>
        <template v-if="variant === 'validation'" #hint>Up to 80 characters · 2 files · 1 kB each · TXT, CSV, or PDF</template>
      </MessageComposer>
      <p v-if="variant === 'pending'" class="message-composer-demo__note">This example holds the request. Complete it, simulate an error, or cancel.</p>
      <p v-if="status" class="message-composer-demo__note" role="status">{{ status }}</p>
    </div>
  </section>
</template>

<style scoped>
.message-composer-demo { display: flex; flex-direction: column; gap: 1.25rem; inline-size: 100%; max-inline-size: 46rem; min-inline-size: 0; color: var(--kappa-default); font-family: var(--kappa-font-sans); }
.message-composer-demo__header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-block-end: 1rem; border-block-end: 1px solid var(--kappa-line); }
.message-composer-demo__header h2 { margin: 0.25rem 0 0; font-size: 1.0625rem; line-height: 1.4; }
.message-composer-demo__eyebrow, .message-composer-demo__participants { color: var(--kappa-subtle); font-size: 0.6875rem; }
.message-composer-demo__eyebrow { font-family: var(--kappa-font-mono); }
.message-composer-demo__thread { display: grid; align-content: start; gap: 1.25rem; min-inline-size: 0; }
.message-composer-demo__thread:empty { display: none; }
.message-composer-demo__message { display: grid; grid-template-columns: 1.75rem minmax(0, 1fr); gap: 0.75rem; font-size: 0.8125rem; line-height: 1.6; }
.message-composer-demo__avatar { display: grid; place-items: center; inline-size: 1.75rem; block-size: 1.75rem; background: var(--kappa-tint); color: var(--kappa-subtle); border: 1px solid var(--kappa-line); border-radius: 0.375rem; font-size: 0.625rem; font-weight: 650; }
.message-composer-demo__avatar--accent { background: color-mix(in srgb, var(--kappa-accent) 10%, var(--kappa-base)); color: var(--kappa-accent); }
.message-composer-demo__message header { display: flex; align-items: baseline; gap: 0.625rem; }
.message-composer-demo__message header strong { font-size: 0.75rem; font-weight: 600; }
.message-composer-demo__message header span { color: var(--kappa-subtle); font-size: 0.6875rem; }
.message-composer-demo__message p { margin: 0.125rem 0 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.message-composer-demo__message ul { margin: 0.5rem 0 0; padding-inline-start: 1rem; color: var(--kappa-subtle); font-size: 0.75rem; overflow-wrap: anywhere; }
.message-composer-demo__compose { min-inline-size: 0; }
.message-composer-demo__note { margin: 0.75rem 0 0; color: var(--kappa-subtle); font-size: 0.75rem; }
.message-composer-demo__state-controls { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-block-end: 1rem; }
.message-composer-demo--standalone { min-block-size: calc(100dvh - 8rem); margin-inline: auto; }
.message-composer-demo--standalone .message-composer-demo__thread { flex: 1; }
@media (max-width: 36rem) { .message-composer-demo__participants { display: none; } }
</style>
