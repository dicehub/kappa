import previewCode from "../snippets/code-highlighted/LanguageSwitch.vue?raw";
import languageSwitchCode from "../snippets/code-highlighted/NumberedLanguageSwitch.vue?raw";

export { previewCode, languageSwitchCode };

export const installationCode = `import {
  CodeHighlighted,
  CodeHighlightedRoot,
  ShikiProvider,
  useShikiHighlighter,
} from "@dicehub/kappa/components/code-highlighted";`;

export const usageCode = `<script setup>
import { CodeHighlighted, ShikiProvider } from "@dicehub/kappa/components/code-highlighted";

const code = \`interface BoundaryPatch {
  name: string;
  type: "inlet" | "outlet" | "wall";
  faces: number;
}\`;
</script>

<template>
  <ShikiProvider :languages="['typescript']">
    <CodeHighlighted :code="code" lang="typescript" />
  </ShikiProvider>
</template>`;

export const languagesCode = `<ShikiProvider :languages="['typescript', 'vue', 'bash', 'json', 'css']">
  <CodeHighlighted :code="fetchRunSource" lang="typescript" />
  <CodeHighlighted :code="sfcSource" lang="vue" />
  <CodeHighlighted :code="installCommands" lang="bash" />
  <CodeHighlighted :code="solverConfig" lang="json" />
  <CodeHighlighted :code="tokenStyles" lang="css" />
</ShikiProvider>`;

export const titleCode = `<CodeHighlighted
  title="mesh-partition.ts"
  :code="code"
  lang="typescript"
  show-copy-button
/>`;

export const highlightLinesCode = `<CodeHighlighted :code="code" lang="typescript" :highlight-lines="[3]" />`;

export const highlightColorCode = `<template>
  <CodeHighlighted
    class="accent-lines"
    :code="code"
    lang="typescript"
    :highlight-lines="[3]"
  />
</template>

<style scoped>
.accent-lines {
  --kappa-code-highlight-bg: color-mix(in oklab, var(--kappa-accent, #4356e8) 14%, transparent);
}
</style>`;

export const lineNumbersCode = `<CodeHighlighted :code="code" lang="typescript" show-line-numbers />`;

export const copyButtonCode = `<CodeHighlighted code="pnpm add @dicehub/kappa" lang="bash" show-copy-button />`;

export const labelsCode = `<ShikiProvider :languages="['typescript']" :labels="{ copy: 'Kopieren', copied: 'Kopiert!' }">
  <CodeHighlighted :code="code" lang="typescript" show-copy-button />
</ShikiProvider>`;

export const shikiProviderProps = [
  { name: "languages", type: "string[]", defaultValue: "required", description: "Languages to load; only these get highlighted." },
  { name: "engine", type: '"javascript" | "wasm"', defaultValue: '"javascript"', description: "Shiki regex engine; JavaScript is smaller, Oniguruma (wasm) is more accurate." },
  { name: "labels", type: "CodeHighlightedLabels", defaultValue: "Copy / Copied! / Code language", description: "Copy-button and language-selector labels for every CodeHighlighted inside." },
] as const;

export const codeHighlightedProps = [
  { name: "code", type: "string", defaultValue: "required", description: "Source text to display." },
  { name: "lang", type: "LanguageInput | string", defaultValue: "required", description: "Language id or alias; must be in the provider languages." },
  { name: "languageOptions", type: "CodeHighlightedLanguageOption[]", defaultValue: "[]", description: "Language choices shown in the header; use with v-model:lang." },
  { name: "title", type: "string", defaultValue: "—", description: "Optional file name or short label rendered above the code." },
  { name: "showLineNumbers", type: "boolean", defaultValue: "false", description: "Adds a line-number column for multi-line code." },
  { name: "highlightLines", type: "number[]", defaultValue: "[]", description: "1-indexed lines to emphasize." },
  { name: "showCopyButton", type: "boolean", defaultValue: "false", description: "Shows the copy button; always visible on single-line blocks." },
  { name: "labels", type: "CodeHighlightedLabels", defaultValue: "provider", description: "Overrides provider labels for this block." },
] as const;

export const exportsList = [
  { name: "CodeHighlighted", description: "Compound API exposing Root and Provider." },
  { name: "CodeHighlightedRoot", description: "Unaugmented code display component." },
  { name: "ShikiProvider", description: "Lazy-loads one shared Shiki highlighter for all child blocks." },
  { name: "useShikiHighlighter", description: "Access highlight, loading state, and labels inside a provider." },
  { name: "normalizeCodeHighlightedLanguage", description: "Resolves aliases to supported language ids." },
  { name: "DEFAULT_CODE_HIGHLIGHTED_LABELS", description: "Default copy-button and language-selector labels." },
  { name: "CodeHighlightedLabels", description: "Copy-button and language-selector label overrides." },
  { name: "CodeHighlightedEmits", description: "Events, including update:lang for language selection." },
  { name: "CodeHighlightedLanguageOption", description: "A language choice with a label and value." },
  { name: "CodeHighlightedProps", description: "Public component props." },
  { name: "LanguageAlias", description: "Supported shorthand language ids." },
  { name: "LanguageInput", description: "Supported language ids and aliases." },
  { name: "ShikiEngine", description: "Supported Shiki engine names." },
  { name: "ShikiProviderProps", description: "Provider props." },
  { name: "SupportedLanguage", description: "Languages available through the dedicated entry point." },
  { name: "UseShikiHighlighterResult", description: "Return type of useShikiHighlighter." },
] as const;
