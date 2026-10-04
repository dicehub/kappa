<script setup lang="ts">
import { ref } from "vue";
import { InlineCopyText } from "@dicehub/kappa/components/inline-copy-text";

withDefaults(defineProps<{
  variant?: "preview" | "row" | "custom" | "styles" | "states";
}>(), { variant: "preview" });

const value = ref("job_0842");
const copyCount = ref(0);
const clickCount = ref(0);
</script>

<template>
  <div class="inline-copy-text-demo" :data-inline-copy-text-demo="variant">
    <div v-if="variant === 'preview'" class="inline-copy-text-demo__stack">
      <span class="inline-copy-text-demo__label">Workspace ID</span>
      <p class="inline-copy-text-demo__sentence">
        Use <InlineCopyText value="ws_8f2c4a91" copy-label="Copy workspace ID" /> in your request.
      </p>
    </div>

    <div v-else-if="variant === 'row'" class="inline-copy-text-demo__row" data-kappa-copy-group>
      <a href="#custom-display">Simulation workspace</a>
      <InlineCopyText value="ws_8f2c4a91" copy-label="Copy workspace ID" />
    </div>

    <div v-else-if="variant === 'custom'" class="inline-copy-text-demo__stack">
      <InlineCopyText value="run_20261004_0842_eu_central" copy-label="Copy full run ID">
        run_<strong>0842</strong>…
      </InlineCopyText>
      <span class="inline-copy-text-demo__label">Copy the full ID from a short label.</span>
    </div>

    <div v-else-if="variant === 'styles'" class="inline-copy-text-demo__stack">
      <InlineCopyText value="build_0842" variant="body" size="base" bold icon-visibility="always" />
      <InlineCopyText value="eu-central" variant="secondary" size="xs" />
      <InlineCopyText
        value="run_20261004_0842_eu_central_simulation"
        copy-label="Copy long run ID"
        truncate
        style="max-inline-size: 12rem"
      />
    </div>

    <div v-else class="inline-copy-text-demo__stack">
      <label class="inline-copy-text-demo__label">
        Job ID
        <input v-model="value" class="inline-copy-text-demo__input" />
      </label>
      <InlineCopyText
        :value="value"
        copy-label="Copy job ID"
        copied-label="Job ID copied"
        :timeout="800"
        data-example="editable-value"
        @click="clickCount++"
        @status-change="copyCount++"
      />
      <span class="inline-copy-text-demo__label" data-copy-count>
        Copies: {{ copyCount }} · Clicks: {{ clickCount }}
      </span>
      <InlineCopyText value="job_pending" copy-label="Copy pending job ID" disabled />
      <InlineCopyText
        value="auftrag_0842"
        copy-label="Auftrags-ID kopieren"
        copied-label="Kopiert"
        lang="de"
      />
    </div>
  </div>
</template>

<style scoped>
.inline-copy-text-demo {
  display: grid;
  inline-size: min(100%, 32rem);
  min-inline-size: 0;
  min-block-size: 6rem;
  place-items: center;
  font-family: var(--docs-font-sans);
}

.inline-copy-text-demo__stack {
  display: flex;
  max-inline-size: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.inline-copy-text-demo__sentence {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.8125rem;
}

.inline-copy-text-demo__label {
  display: grid;
  gap: 0.375rem;
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.inline-copy-text-demo__row {
  display: flex;
  inline-size: 100%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 2rem;
  padding-block: 0.75rem;
  border-block: 1px solid var(--docs-line);
  font-size: 0.875rem;
}

.inline-copy-text-demo__input {
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--docs-line);
  border-radius: 0.25rem;
  background: var(--docs-control);
  color: var(--docs-default);
  font: inherit;
}
</style>
