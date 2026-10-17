<script setup lang="ts">
import { CodeBlock, ShikiProvider } from "@dicehub/kappa/components/code-block";

const code = `export async function fetchRuns(projectId: string) {
  const query = new URLSearchParams({ projectId });
  const response = await fetch(\`/api/runs?\${query}\`);

  if (!response.ok) {
    throw new Error("Could not fetch runs");
  }

  const runs = await response.json();
  return runs.filter((run) => run.status === "completed");
}

const runs = await fetchRuns("wind-tunnel");
console.log(runs);`;
</script>

<template>
  <ShikiProvider :languages="['typescript']">
    <CodeBlock
      title="fetch-runs.ts"
      :code="code"
      lang="typescript"
      collapsible
      :collapsed-lines="6"
      show-line-numbers
      show-copy-button
      wrap
    />
  </ShikiProvider>
</template>
