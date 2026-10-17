<script setup lang="ts">
import { TerminalIcon } from "@lucide/vue";
import { CodeBlock } from "@dicehub/kappa/components/code-block";

const output = `$ pnpm add @dicehub/kappa
Packages installed.
Done.`;
</script>

<template>
  <CodeBlock title="Terminal" :code="output" show-copy-button>
    <template #title>
      <TerminalIcon aria-hidden="true" />
      Terminal
    </template>
  </CodeBlock>
</template>
