<script setup lang="ts">
import { DiffViewer } from "@dicehub/kappa/components/diff-viewer";
const patch = (body: string) => `--- a/config.yaml\n+++ b/config.yaml\n${body}`;
</script>

<template>
  <main>
    <h1>Diff consumer</h1>
    <DiffViewer label="Unpaired replacements" view="split" :copyable="false"
      :patch="patch('@@ -1,2 +1 @@\n-one\n-two\n+three')" />
    <DiffViewer label="Addition and context" view="split" :copyable="false"
      :patch="patch('@@ -1 +1,2 @@\n+new\n kept')" />
  </main>
</template>
