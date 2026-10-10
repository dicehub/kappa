<script setup lang="ts">
import { ref } from "vue";
import { CodeHighlighted, ShikiProvider } from "@dicehub/kappa/components/code-highlighted";

const language = ref("javascript");
const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Bash", value: "bash" },
];
const code: Record<string, string> = {
  javascript: `async function fetchRun(id) {
  const response = await fetch(\`https://api.example.com/runs/\${id}\`);
  if (!response.ok) throw new Error("Could not fetch run");
  return response.json();
}

const run = await fetchRun("run-042");
console.log(run.status);`,
  python: `import json
from urllib.request import urlopen

def fetch_run(run_id):
    with urlopen(f"https://api.example.com/runs/{run_id}") as response:
        return json.load(response)

run = fetch_run("run-042")
print(run["status"])`,
  bash: `curl --fail --silent \\
  "https://api.example.com/runs/run-042" \\
  | jq -r '.status'`,
};
</script>

<template>
  <ShikiProvider :languages="['javascript', 'python', 'bash']">
    <CodeHighlighted
      v-model:lang="language"
      :code="code[language]"
      :language-options="languageOptions"
      title="Fetch a simulation run"
      show-line-numbers
      show-copy-button
    />
  </ShikiProvider>
</template>
