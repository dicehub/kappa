<script setup lang="ts">
import { ref } from "vue";
import { ClipboardText } from "@dicehub/kappa/components/clipboard-text";

type DemoVariant = "preview" | "usage" | "value-text" | "timeout" | "controlled";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const runId = ref("run_01J9X7KQ2M4V8N6P3R5T7W9Y0B");
const lastCopied = ref("none");
</script>

<template>
  <div class="clipboard-text-demo" :data-clipboard-text-demo="variant">
    <section v-if="variant === 'preview'" class="clipboard-text-demo__stack">
      <ClipboardText.Root default-value="ws_01J9X4A8C2E6G0K4M8P2R6T0V4">
        <ClipboardText.Label>Workspace ID</ClipboardText.Label>
        <ClipboardText.Control>
          <ClipboardText.Input />
          <ClipboardText.Trigger aria-label="Copy workspace ID" />
        </ClipboardText.Control>
      </ClipboardText.Root>
      <span class="clipboard-text-demo__hint">Copy the ID, then paste it anywhere.</span>
    </section>

    <ClipboardText.Root
      v-else-if="variant === 'usage'"
      default-value="https://example.com/docs/components/clipboard-text"
    >
      <ClipboardText.Label>Documentation URL</ClipboardText.Label>
      <ClipboardText.Control>
        <ClipboardText.Input />
        <ClipboardText.Trigger aria-label="Copy documentation URL" />
      </ClipboardText.Control>
    </ClipboardText.Root>

    <section v-else-if="variant === 'value-text'" class="clipboard-text-demo__stack">
      <ClipboardText.Root default-value="demo_access_token_not_valid">
        <div class="clipboard-text-demo__inline">
          <ClipboardText.ValueText />
          <ClipboardText.Trigger aria-label="Copy access token" />
        </div>
      </ClipboardText.Root>
      <span class="clipboard-text-demo__hint">
        ValueText composes inline without the bordered control.
      </span>
    </section>

    <ClipboardText.Root
      v-else-if="variant === 'timeout'"
      default-value="token_short_feedback"
      :timeout="800"
    >
      <ClipboardText.Label>Short feedback window (800 ms)</ClipboardText.Label>
      <ClipboardText.Control>
        <ClipboardText.Input />
        <ClipboardText.Trigger aria-label="Copy token" />
      </ClipboardText.Control>
    </ClipboardText.Root>

    <section v-else class="clipboard-text-demo__stack">
      <ClipboardText.Root
        v-model="runId"
        @status-change="lastCopied = $event.copied ? runId : lastCopied"
      >
        <ClipboardText.Label>Run ID</ClipboardText.Label>
        <ClipboardText.Control>
          <ClipboardText.Input />
          <ClipboardText.Trigger aria-label="Copy run ID" />
        </ClipboardText.Control>
      </ClipboardText.Root>
      <output class="clipboard-text-demo__readout" aria-live="polite">
        Last copied: <strong>{{ lastCopied }}</strong>
      </output>
    </section>
  </div>
</template>

<style scoped>
.clipboard-text-demo {
  display: grid;
  width: min(100%, 40rem);
  min-width: 0;
  min-height: 6rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.clipboard-text-demo__stack {
  display: grid;
  width: min(100%, 24rem);
  gap: 0.625rem;
}

.clipboard-text-demo__stack > :deep(.kappa-clipboard-text) {
  width: 100%;
}

.clipboard-text-demo__inline {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.clipboard-text-demo__inline :deep(.kappa-clipboard-text__trigger) {
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border: 0;
  border-radius: 0.375rem;
}

.clipboard-text-demo__hint,
.clipboard-text-demo__readout {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.clipboard-text-demo__readout strong {
  color: var(--docs-default);
  font-family: var(--docs-font-mono);
  font-size: 0.6875rem;
}
</style>
