<script setup lang="ts">
import { Tabs } from "@dicehub/kappa";
import { CodeBlock, ShikiProvider } from "@dicehub/kappa/components/code-block";

const files = [
  {
    name: "client.ts",
    lang: "typescript",
    code: `export async function fetchRun(id: string) {
  const response = await fetch(\`/api/runs/\${id}\`);
  if (!response.ok) throw new Error("Could not fetch run");
  return response.json();
}`,
  },
  {
    name: "config.json",
    lang: "json",
    code: `{
  "solver": "pimpleFoam",
  "partitions": 8,
  "adaptive": true
}`,
  },
  {
    name: "run.sh",
    lang: "bash",
    code: `#!/usr/bin/env bash
set -euo pipefail
curl --fail --silent "https://api.example.com/runs/run-042"`,
  },
];
</script>

<template>
  <ShikiProvider :languages="['typescript', 'json', 'bash']">
    <Tabs.Root default-value="client.ts" lazy-mount unmount-on-exit>
      <Tabs.List variant="line" aria-label="Example files">
        <Tabs.Trigger v-for="file in files" :key="file.name" :value="file.name">
          {{ file.name }}
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content v-for="file in files" :key="file.name" :value="file.name">
        <CodeBlock :title="file.name" :code="file.code" :lang="file.lang" show-line-numbers show-copy-button />
      </Tabs.Content>
    </Tabs.Root>
  </ShikiProvider>
</template>
