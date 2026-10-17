<script setup lang="ts">
import { ref } from "vue";
import { Tabs } from "@dicehub/kappa";
import { CodeBlock, ShikiProvider } from "@dicehub/kappa/components/code-block";

const language = ref("typescript");
const languages = [
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
];
const examples: { value: string; label: string; code: Record<string, string> }[] = [
  {
    value: "simple",
    label: "Basic request",
    code: {
      typescript: `const response = await fetch("https://api.example.com/runs");
const runs = await response.json();
console.log(runs);`,
      python: `import json
from urllib.request import urlopen

with urlopen("https://api.example.com/runs") as response:
    runs = json.load(response)
print(runs)`,
    },
  },
  {
    value: "filtered",
    label: "With filters",
    code: {
      typescript: `const query = new URLSearchParams({ status: "completed", limit: "10" });
const response = await fetch(\`https://api.example.com/runs?\${query}\`);
const runs = await response.json();`,
      python: `import json
from urllib.parse import urlencode
from urllib.request import urlopen

query = urlencode({"status": "completed", "limit": 10})
with urlopen(f"https://api.example.com/runs?{query}") as response:
    runs = json.load(response)`,
    },
  },
];
</script>

<template>
  <ShikiProvider :languages="['typescript', 'python']">
    <Tabs.Root default-value="simple" lazy-mount unmount-on-exit>
      <Tabs.List aria-label="Request examples">
        <Tabs.Trigger v-for="example in examples" :key="example.value" :value="example.value">
          {{ example.label }}
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content v-for="example in examples" :key="example.value" :value="example.value">
        <CodeBlock
          v-model:lang="language"
          :title="example.label"
          :code="example.code[language] ?? ''"
          :language-options="languages"
          show-line-numbers
          show-copy-button
        />
      </Tabs.Content>
    </Tabs.Root>
  </ShikiProvider>
</template>
