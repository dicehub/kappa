<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa";
import { CodeBlock, ShikiProvider } from "@dicehub/kappa/components/code-block";

const wrap = ref(false);
const code = `const endpoint = "https://api.example.com/projects/wind-tunnel/runs/run-042/results?fields=pressure,velocity,turbulence&format=json";

const response = await fetch(endpoint);
const results = await response.json();`;
</script>

<template>
  <ShikiProvider :languages="['typescript']">
    <CodeBlock title="Fetch simulation results" :code="code" lang="typescript" :wrap="wrap" show-line-numbers show-copy-button>
      <template #actions>
        <Button variant="ghost" size="sm" :aria-pressed="wrap" @click="wrap = !wrap">
          Wrap lines
        </Button>
      </template>
    </CodeBlock>
  </ShikiProvider>
</template>
