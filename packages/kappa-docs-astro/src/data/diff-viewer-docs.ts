export const previewPatch = `--- a/app.yaml
+++ b/app.yaml
@@ -1,4 +1,4 @@
 service: background-jobs
-retryLimit: 3
+retryLimit: 5
 timeout: 30000
 concurrency: 8
`;

export const multiplePatch = `${previewPatch}diff --git a/notifications.yaml b/notifications.yaml
new file mode 100644
--- /dev/null
+++ b/notifications.yaml
@@ -0,0 +1,2 @@
+enabled: true
+channels: [email, webhook]
`;

export const longPatch = `--- a/report.ts
+++ b/report.ts
@@ -1,2 +1,3 @@
-export const fields = ["jobId", "status"];
+export const fields = ["jobId", "status", "createdAt", "completedAt", "durationMs", "attemptCount", "correlationId"];
 export const format = "csv";
+export const title = '<img src=x onerror="alert(1)">';
`;

export const previewCode = `<script setup>
import { DiffViewer } from "@dicehub/kappa/components/diff-viewer";

const patch = \`${previewPatch.trimEnd()}\`;
</script>

<template>
  <DiffViewer :patch="patch" label="Application settings" />
</template>`;

export const splitCode = `<script setup lang="ts">
import { ref } from "vue";
import { DiffViewer } from "@dicehub/kappa/components/diff-viewer";
import { Button } from "@dicehub/kappa/components/button";

const split = ref(false);
const patch = \`${previewPatch.trimEnd()}\`;
</script>

<template>
  <Button size="sm" :aria-pressed="split" @click="split = !split">
    Split view
  </Button>
  <DiffViewer
    :patch="patch"
    label="Application settings"
    :view="split ? 'split' : 'unified'"
  />
</template>`;

export const multipleCode = `<script setup lang="ts">
import { DiffViewer } from "@dicehub/kappa/components/diff-viewer";

const patch = \`${multiplePatch.trimEnd()}\`;
</script>

<template>
  <DiffViewer :patch="patch" label="Service configuration" />
</template>`;

export const statesCode = `<script setup lang="ts">
import { ref } from "vue";
import { DiffViewer } from "@dicehub/kappa/components/diff-viewer";
import { Button } from "@dicehub/kappa/components/button";

const validPatch = \`${previewPatch.trimEnd()}\`;
const patch = ref(validPatch);
</script>

<template>
  <Button size="sm" @click="patch = ''">Empty patch</Button>
  <Button size="sm" @click="patch = 'incomplete patch'">Invalid patch</Button>
  <Button size="sm" @click="patch = validPatch">Valid patch</Button>
  <DiffViewer :patch="patch" label="Patch state" />
</template>`;

export const compactCode = `<script setup lang="ts">
import { DiffViewer } from "@dicehub/kappa/components/diff-viewer";

const patch = \`${previewPatch.trimEnd()}\`;
</script>

<template>
  <DiffViewer
    :patch="patch"
    label="Compact review"
    :line-numbers="false"
    :inline-changes="false"
    :copyable="false"
  />
</template>`;

export const scrollingCode = `<script setup lang="ts">
import { DiffViewer } from "@dicehub/kappa/components/diff-viewer";

const patch = \`${longPatch.trimEnd()}\`;
</script>

<template>
  <DiffViewer :patch="patch" label="Report export" class="review" />
</template>

<style scoped>
.review { --kappa-diff-viewer-max-height: 18rem; }
</style>`;

export const parserCode = `import { parseUnifiedDiff } from "@dicehub/kappa/components/diff-viewer";

const patch = \`${previewPatch.trimEnd()}\`;

try {
  const { files, additions, deletions } = parseUnifiedDiff(patch);
  console.log(files.length, additions, deletions);
} catch (error) {
  // A malformed or unsupported patch throws before any partial result is returned.
  console.error(error.message);
}`;

export const props = [
  ["patch", "string", "required", "Complete unified text patch; empty text means no changes."],
  ["label", "string", '"File changes"', "Visible title and accessible name."],
  ["view", '"unified" | "split"', '"unified"', "Unified rows or paired Before/After columns."],
  ["lineNumbers", "boolean", "true", "Show original and new line numbers."],
  ["inlineChanges", "boolean", "true", "Emphasize changed characters in equal-length replacement blocks."],
  ["copyable", "boolean", "true", "Show the Ark UI copy control for a valid patch."],
  ["labels", "Partial<DiffViewerLabels>", "English labels", "Translate copy, state, column, and change labels."],
];
