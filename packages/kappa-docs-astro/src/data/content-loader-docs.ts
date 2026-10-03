export const previewCode = `<script setup lang="ts">
import { ContentLoader } from "@dicehub/kappa/components/content-loader";
import { ref } from "vue";
const state = ref<"ready" | "loading" | "empty" | "error">("loading");

async function loadCases() {
  state.value = "loading";
  // Load data in your application, then set ready, empty, or error.
}
</script>

<template>
  <ContentLoader :state="state" loading-label="Loading cases…"
    empty-title="No cases yet" retryable @retry="loadCases">
    <CaseList :items="cases" />
  </ContentLoader>
</template>`;

export const examples = [
  { id: "compact", title: "Compact", description: "Use a shorter placeholder inside side panels and small cards.",
    code: `<ContentLoader state="loading" compact loading-label="Loading cases…" />` },
  { id: "custom", title: "Custom states", description: "Replace each state with a skeleton, guidance, or recovery controls.",
    code: `<ContentLoader :state="state" @retry="loadCases">
  <template #loading><SkeletonLine /></template>
  <template #empty>
    <p>No cases match the current filter.</p>
    <Button @click="clearFilter">Clear filter</Button>
  </template>
  <template #error="{ retry }">
    <p>The case service is unavailable.</p>
    <Button @click="retry">Reconnect</Button>
  </template>
  <CaseList :items="cases" />
</ContentLoader>` },
  { id: "preserve", title: "Preserve mounted content", description: "Write a note, then refresh. The input DOM node and its local state remain intact.",
    code: `<ContentLoader :state="state" keep-mounted>
  <Input v-model="note" aria-label="Run note" />
</ContentLoader>` },
] as const;
