<script setup lang="ts">
import type { DiffLine, DiffViewerLabels } from "./diff-viewer";

defineProps<{ line: DiffLine; inlineChanges: boolean; labels: DiffViewerLabels }>();
</script>

<template>
  <div class="kappa-diff-viewer__line">
    <span class="kappa-diff-viewer__marker" aria-hidden="true">{{ line.kind === 'added' ? '+' : line.kind === 'removed' ? '−' : ' ' }}</span>
    <span class="kappa-diff-viewer__sr">{{ labels[line.kind === 'context' ? 'unchanged' : line.kind] }}: </span>
    <code class="kappa-diff-viewer__code"><template v-if="inlineChanges && line.changed">{{ line.text.slice(0, line.changed[0]) }}<mark class="kappa-diff-viewer__changed">{{ line.text.slice(...line.changed) }}</mark>{{ line.text.slice(line.changed[1]) }}</template><template v-else>{{ line.text }}</template></code>
  </div>
  <span v-if="line.noNewline" class="kappa-diff-viewer__note">\ {{ labels.noNewline }}</span>
</template>
