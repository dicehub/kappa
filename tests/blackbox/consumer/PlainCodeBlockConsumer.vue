<script setup lang="ts">
import { ref } from "vue";
import { CodeBlock } from "@dicehub/kappa/components/code-block";

const code = ref('$ pnpm build\n\n<script>window.unsafe = true<\/script>\nBuild complete.');
const language = ref<string>();
</script>

<template>
  <main>
    <button @click="code += '\nAll checks passed.'">Append output</button>
    <button @click="language = 'typescript'">Set a language hint</button>
    <CodeBlock
      title="Plain build output"
      :code="code"
      :lang="language"
      :labels="{ copy: 'Copy output', copied: 'Output copied' }"
      show-line-numbers
      show-copy-button
      collapsible
      :collapsed-lines="2"
      wrap
    />
  </main>
</template>
