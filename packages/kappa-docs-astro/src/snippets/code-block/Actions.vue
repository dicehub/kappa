<script setup lang="ts">
import { ref } from "vue";
import { DownloadIcon, TerminalIcon, WrapTextIcon } from "@lucide/vue";
import { Button, LinkButton } from "@dicehub/kappa";
import { CodeBlock } from "@dicehub/kappa/components/code-block";

const wrap = ref(true);
const output = `$ pnpm lint
src/pages/runs.vue
  8:15  error    'runs' is possibly 'undefined'. Check the response before reading the first run.
  24:7  warning  'selectedRun' is declared but its value is never read.

2 problems (1 error, 1 warning)`;
const downloadHref = `data:text/plain;charset=utf-8,${encodeURIComponent(output)}`;
</script>

<template>
  <CodeBlock title="Terminal" :code="output" :wrap="wrap" show-copy-button>
    <template #title>
      <TerminalIcon aria-hidden="true" />
      Terminal
    </template>
    <template #actions>
      <Button
        variant="ghost"
        size="xs"
        shape="square"
        :icon="WrapTextIcon"
        aria-label="Wrap lines"
        :aria-pressed="wrap"
        @click="wrap = !wrap"
      />
      <LinkButton
        :href="downloadHref"
        download="lint.log"
        variant="ghost"
        size="xs"
        shape="square"
        :icon="DownloadIcon"
        aria-label="Download output"
      />
    </template>
  </CodeBlock>
</template>
