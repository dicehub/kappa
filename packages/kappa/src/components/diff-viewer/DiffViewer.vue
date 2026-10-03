<script setup lang="ts">
import { computed } from "vue";
import { ClipboardText } from "../clipboard-text";
import DiffViewerLine from "./DiffViewerLine.vue";
import { DIFF_VIEWER_DEFAULT_LABELS, type DiffViewerProps } from "./diff-viewer";
import { createSplitDiffRows } from "./diff-viewer-rows";
import { parseUnifiedDiff } from "./parse-unified-diff";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<DiffViewerProps>(), {
  label: "File changes", view: "unified", lineNumbers: true, inlineChanges: true,
  copyable: true, labels: () => ({}),
});
const labels = computed(() => ({ ...DIFF_VIEWER_DEFAULT_LABELS, ...props.labels }));
const parsed = computed(() => {
  try { return { document: parseUnifiedDiff(props.patch), invalid: false }; }
  catch { return { document: null, invalid: true }; }
});
const files = computed(() => parsed.value.document?.files.map((file) => ({
  ...file,
  path: file.newPath === "/dev/null" ? file.oldPath : file.newPath,
  hunks: file.hunks.map((hunk) => ({ ...hunk, splitRows: props.view === "split" ? createSplitDiffRows(hunk.lines) : [] })),
})) ?? []);
const state = computed(() => parsed.value.invalid ? "invalid" : files.value.length ? "ready" : "empty");
const columns = computed(() => props.view === "split" ? (props.lineNumbers ? 4 : 2) : (props.lineNumbers ? 3 : 1));
</script>

<template>
  <section v-bind="$attrs" class="kappa-diff-viewer" data-slot="diff-viewer" :data-state="state" :data-view="view" :aria-label="label">
    <header class="kappa-diff-viewer__header">
      <span class="kappa-diff-viewer__title">{{ label }}</span>
      <span v-if="parsed.document && files.length" class="kappa-diff-viewer__counts">
        <span class="kappa-diff-viewer__addition" :aria-label="`${labels.added}: ${parsed.document.additions}`">+{{ parsed.document.additions }}</span>
        <span class="kappa-diff-viewer__deletion" :aria-label="`${labels.removed}: ${parsed.document.deletions}`">−{{ parsed.document.deletions }}</span>
      </span>
      <ClipboardText.Root v-if="copyable && state === 'ready'" :key="patch" :model-value="patch" class="kappa-diff-viewer__clipboard" :timeout="2000">
        <ClipboardText.Context v-slot="clipboard">
          <ClipboardText.Trigger class="kappa-diff-viewer__copy" :aria-label="clipboard.copied ? labels.copied : labels.copy" />
          <span class="kappa-diff-viewer__sr" role="status">{{ clipboard.copied ? labels.copied : '' }}</span>
        </ClipboardText.Context>
      </ClipboardText.Root>
    </header>
    <p v-if="state !== 'ready'" class="kappa-diff-viewer__notice" role="status">{{ state === 'invalid' ? labels.invalid : labels.empty }}</p>
    <div v-else class="kappa-diff-viewer__scroll" tabindex="0" role="region" :aria-label="`${label}: ${labels.content}`" dir="ltr">
      <section v-for="(file, fileIndex) in files" :key="fileIndex" class="kappa-diff-viewer__file" :aria-label="file.path">
        <header class="kappa-diff-viewer__file-header">
          <code class="kappa-diff-viewer__path"><template v-if="file.oldPath !== file.newPath && file.oldPath !== '/dev/null' && file.newPath !== '/dev/null'">{{ file.oldPath }} → </template>{{ file.path }}</code>
          <span v-if="files.length > 1" class="kappa-diff-viewer__counts">
            <span class="kappa-diff-viewer__addition" :aria-label="`${labels.added}: ${file.additions}`">+{{ file.additions }}</span>
            <span class="kappa-diff-viewer__deletion" :aria-label="`${labels.removed}: ${file.deletions}`">−{{ file.deletions }}</span>
          </span>
        </header>
        <table class="kappa-diff-viewer__table" :aria-label="file.path">
          <thead :class="view === 'unified' ? 'kappa-diff-viewer__sr' : 'kappa-diff-viewer__head'">
            <tr v-if="view === 'split'"><th :colspan="lineNumbers ? 2 : 1" scope="colgroup">{{ labels.before }}</th><th :colspan="lineNumbers ? 2 : 1" scope="colgroup">{{ labels.after }}</th></tr>
            <tr v-else><th v-if="lineNumbers" scope="col">{{ labels.before }}</th><th v-if="lineNumbers" scope="col">{{ labels.after }}</th><th scope="col">{{ labels.content }}</th></tr>
          </thead>
          <tbody v-for="(hunk, hunkIndex) in file.hunks" :key="hunkIndex">
            <tr class="kappa-diff-viewer__hunk"><td :colspan="columns">{{ hunk.header }}</td></tr>
            <template v-if="view === 'unified'">
              <tr v-for="(line, lineIndex) in hunk.lines" :key="lineIndex" :data-kind="line.kind">
                <td v-if="lineNumbers" class="kappa-diff-viewer__number">{{ line.oldLine }}</td>
                <td v-if="lineNumbers" class="kappa-diff-viewer__number">{{ line.newLine }}</td>
                <td class="kappa-diff-viewer__cell"><DiffViewerLine :line="line" :inline-changes="inlineChanges" :labels="labels" /></td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(row, rowIndex) in hunk.splitRows" :key="rowIndex">
                <td v-if="lineNumbers" class="kappa-diff-viewer__number" :data-kind="row.before?.kind">{{ row.before?.oldLine }}</td>
                <td class="kappa-diff-viewer__cell kappa-diff-viewer__before" :data-kind="row.before?.kind" :data-empty="!row.before || undefined"><DiffViewerLine v-if="row.before" :line="row.before" :inline-changes="inlineChanges" :labels="labels" /></td>
                <td v-if="lineNumbers" class="kappa-diff-viewer__number" :data-kind="row.after?.kind">{{ row.after?.newLine }}</td>
                <td class="kappa-diff-viewer__cell" :data-kind="row.after?.kind" :data-empty="!row.after || undefined"><DiffViewerLine v-if="row.after" :line="row.after" :inline-changes="inlineChanges" :labels="labels" /></td>
              </tr>
            </template>
          </tbody>
        </table>
      </section>
    </div>
  </section>
</template>

<style src="./diff-viewer.css"></style>
