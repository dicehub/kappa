<script setup lang="ts">
import { ref } from "vue";
import { CodeHighlighted, ShikiProvider } from "@dicehub/kappa/components/code-highlighted";

const language = ref("typescript");
const languageOptions = [
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
];
const titles: Record<string, string> = {
  typescript: "courant-limit.ts",
  python: "courant_limit.py",
};
const code: Record<string, string> = {
  typescript: `// Clamp the Courant number before each iteration
const courant = computed(() => Math.min(rawCourant.value, 5));

watch(courant, (value) => {
  solver.setMaxCourant(value);
});`,
  python: `# Clamp the Courant number before each iteration
courant = min(raw_courant, 5)
solver.set_max_courant(courant)`,
};
</script>

<template>
  <ShikiProvider :languages="['typescript', 'python']">
    <CodeHighlighted
      v-model:lang="language"
      :code="code[language]"
      :title="titles[language]"
      :language-options="languageOptions"
      show-copy-button
    />
  </ShikiProvider>
</template>
