<script setup lang="ts">
import { CodeBlock } from "@dicehub/kappa/components/code-block";

const output = `$ pnpm build
Building application...

12 modules transformed.
Build complete.`;
</script>

<template>
  <CodeBlock title="Build output" :code="output" show-copy-button />
</template>
