<script setup lang="ts">
import { ref } from "vue";
import { DiffViewer } from "@dicehub/kappa/components/diff-viewer";
import { Button } from "@dicehub/kappa/components/button";
import { longPatch, multiplePatch, previewPatch } from "../data/diff-viewer-docs";

defineProps<{ variant?: "preview" | "split" | "multiple" | "states" | "compact" | "scrolling" }>();
const split = ref(false);
const currentPatch = ref(previewPatch);
</script>

<template>
  <div class="diff-viewer-demo" :data-diff-viewer-demo="variant ?? 'preview'">
    <template v-if="variant === 'split'">
      <div class="diff-viewer-demo__actions">
        <Button size="sm" :aria-pressed="split" @click="split = !split">Split view</Button>
      </div>
      <DiffViewer :patch="previewPatch" label="Application settings" :view="split ? 'split' : 'unified'" />
    </template>
    <DiffViewer v-else-if="variant === 'multiple'" :patch="multiplePatch" label="Service configuration" />
    <template v-else-if="variant === 'states'">
      <div class="diff-viewer-demo__actions">
        <Button size="sm" @click="currentPatch = ''">Empty patch</Button>
        <Button size="sm" @click="currentPatch = 'incomplete patch'">Invalid patch</Button>
        <Button size="sm" @click="currentPatch = previewPatch">Valid patch</Button>
      </div>
      <DiffViewer :patch="currentPatch" label="Patch state" />
    </template>
    <DiffViewer v-else-if="variant === 'compact'" :patch="previewPatch" label="Compact review" :line-numbers="false" :inline-changes="false" :copyable="false" />
    <DiffViewer v-else-if="variant === 'scrolling'" :patch="longPatch" label="Report export" />
    <DiffViewer v-else :patch="previewPatch" label="Application settings" />
  </div>
</template>

<style scoped>
.diff-viewer-demo { display: grid; inline-size: 100%; min-inline-size: 0; gap: 0.75rem; }
.diff-viewer-demo__actions { display: flex; flex-wrap: wrap; gap: 0.375rem; }
</style>
