<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { MessageComposer, type MessageComposerPayload } from "@dicehub/kappa/blocks/message-composer";
import { runningJobs, type WorkspaceRun } from "./paneled-workspace-compute";
import type { WorkspaceChatState } from "./paneled-workspace-chat";

const props = defineProps<{ namespace: string; runs: WorkspaceRun[] }>();
const state = defineModel<WorkspaceChatState>({ required: true });
const draft = computed({ get: () => state.value.drafts[props.namespace] ?? "", set: value => { state.value.drafts[props.namespace] = value; } });
const transcript = ref<HTMLElement>();
const messages = computed(() => state.value.threads[props.namespace] ?? []);
const prompts = ["Summarize runs", "Mesh checks", "Convergence checks"];
function reply(text: string) {
  if (/run|status|queue/i.test(text)) {
    const active = runningJobs(props.runs);
    const queued = props.runs.filter(run => run.status === "Queued").length;
    return `${props.namespace} has ${active.length} active runs and ${queued} queued. ${active.length ? `Running: ${active.map(run => run.id).join(', ')}. Open Simulation runs for the full list.` : 'No simulations are using compute now.'}`;
  }
  if (/mesh/i.test(text)) return "Check cell quality, boundary layers, and mesh independence before comparing results. This preview cannot inspect your mesh files.";
  if (/converg|residual|solver/i.test(text)) return "Review residual trends together with mass balance and the forces or quantities you need. A residual alone does not establish convergence. This preview cannot inspect solver logs.";
  return "This local preview can summarize runs or show a mesh or convergence checklist. Try one of the suggested questions.";
}
async function send(payload: MessageComposerPayload) {
  const text = payload.text.trim();
  if (!text) return;
  const thread = state.value.threads[props.namespace] ??= [];
  thread.push({ role: "user", text }, { role: "assistant", text: reply(text) });
  draft.value = "";
  await nextTick();
  transcript.value?.scrollTo({ top: transcript.value.scrollHeight });
}
</script>

<template>
  <div class="paneled-ai-chat">
    <p class="paneled-ai-chat__notice">Demo assistant · local sample replies</p>
    <div ref="transcript" class="paneled-ai-chat__messages" role="log" aria-label="AI chat messages" aria-live="polite">
      <p v-if="!messages.length" class="paneled-ai-chat__intro">Ask about runs, mesh quality, or solver convergence in {{ namespace }}.</p>
      <div v-for="(message, index) in messages" :key="index" class="paneled-ai-chat__message" :data-role="message.role">
        <strong>{{ message.role === 'user' ? 'You' : 'dicehub AI · demo' }}</strong><p>{{ message.text }}</p>
      </div>
    </div>
    <div v-if="!messages.length" class="paneled-ai-chat__prompts"><Button v-for="prompt in prompts" :key="prompt" variant="outline" size="sm" @click="send({ text: prompt, files: [] })">{{ prompt }}</Button></div>
    <MessageComposer v-model="draft" :allow-attachments="false" :max-length="1000" :labels="{ label: 'Message dicehub AI', placeholder: 'Ask about your CFD work…' }" @send="send" />
  </div>
</template>

<style>
.paneled-ai-chat { display: flex; flex: 1; min-block-size: 0; flex-direction: column; gap: 0.75rem; }
.paneled-ai-chat__notice, .paneled-ai-chat__intro { margin: 0; color: var(--kappa-subtle); font-size: 0.75rem; line-height: 1.25rem; }
.paneled-ai-chat__messages { flex: 1; min-block-size: 5rem; overflow-y: auto; overscroll-behavior: contain; }
.paneled-ai-chat__message { padding: 0.75rem 0; border-block-end: 1px solid var(--kappa-line); }
.paneled-ai-chat__message strong { color: var(--kappa-strong); font-size: 0.75rem; font-weight: 550; }
.paneled-ai-chat__message p { margin: 0.375rem 0 0; color: var(--kappa-default); font-size: 0.875rem; line-height: 1.375rem; white-space: pre-wrap; overflow-wrap: anywhere; }
.paneled-ai-chat__prompts { display: flex; flex-wrap: wrap; gap: 0.375rem; }
</style>
