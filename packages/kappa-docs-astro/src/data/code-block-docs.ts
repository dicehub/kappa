import previewCode from "../snippets/code-block/LanguageSwitch.vue?raw";
import languageSwitchCode from "../snippets/code-block/NumberedLanguageSwitch.vue?raw";
import tabbedExamplesCode from "../snippets/code-block/TabbedExamples.vue?raw";
import fileTabsCode from "../snippets/code-block/FileTabs.vue?raw";
import wrapCode from "../snippets/code-block/WrapLines.vue?raw";
import collapsibleCode from "../snippets/code-block/CollapsibleCode.vue?raw";
import plainTextCode from "../snippets/code-block/PlainText.vue?raw";
import headerCode from "../snippets/code-block/Header.vue?raw";
import actionsCode from "../snippets/code-block/Actions.vue?raw";

export { previewCode, languageSwitchCode, tabbedExamplesCode, fileTabsCode, wrapCode, collapsibleCode, plainTextCode, headerCode, actionsCode };

export const installationCode = `import {
  CodeBlock,
  CodeBlockRoot,
  ShikiProvider,
  useShikiHighlighter,
} from "@dicehub/kappa/components/code-block";`;

export const usageCode = `<script setup>
import { CodeBlock, ShikiProvider } from "@dicehub/kappa/components/code-block";

const code = \`interface BoundaryPatch {
  name: string;
  type: "inlet" | "outlet" | "wall";
  faces: number;
}\`;
</script>

<template>
  <ShikiProvider :languages="['typescript']">
    <CodeBlock :code="code" lang="typescript" />
  </ShikiProvider>
</template>`;

export const languagesCode = `<ShikiProvider :languages="['typescript', 'vue', 'bash', 'json', 'css']">
  <CodeBlock :code="fetchRunSource" lang="typescript" />
  <CodeBlock :code="sfcSource" lang="vue" />
  <CodeBlock :code="installCommands" lang="bash" />
  <CodeBlock :code="solverConfig" lang="json" />
  <CodeBlock :code="tokenStyles" lang="css" />
</ShikiProvider>`;

export const titleCode = `<CodeBlock
  title="mesh-partition.ts"
  :code="code"
  lang="typescript"
  show-copy-button
/>`;

export const highlightLinesCode = `<CodeBlock :code="code" lang="typescript" :highlight-lines="[3]" />`;

export const highlightColorCode = `<template>
  <CodeBlock
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

export const lineNumbersCode = `<CodeBlock :code="code" lang="typescript" show-line-numbers />`;

export const copyButtonCode = `<CodeBlock code="pnpm add @dicehub/kappa" lang="bash" show-copy-button />`;

export const labelsCode = `<ShikiProvider :languages="['typescript']" :labels="{ copy: 'Kopieren', copied: 'Kopiert!' }">
  <CodeBlock :code="code" lang="typescript" show-copy-button />
</ShikiProvider>`;

export const shikiProviderProps = [
  { name: "languages", type: "string[]", defaultValue: "required", description: "Languages to load; only these get highlighted." },
  { name: "engine", type: '"javascript" | "wasm"', defaultValue: '"javascript"', description: "Shiki regex engine; JavaScript is smaller, Oniguruma (wasm) is more accurate." },
  { name: "labels", type: "CodeBlockLabels", defaultValue: "Copy / Copied! / Code language", description: "Copy-button and language-selector labels for every CodeBlock inside." },
] as const;

export const codeBlockProps = [
  { name: "code", type: "string", defaultValue: "required", description: "Source text to display." },
  { name: "lang", type: "LanguageInput | string", defaultValue: '"text"', description: "Language id or alias. text, plain, and txt stay plain; other languages use the provider when available." },
  { name: "languageOptions", type: "CodeBlockLanguageOption[]", defaultValue: "[]", description: "Language choices shown in the header; use with v-model:lang." },
  { name: "title", type: "string", defaultValue: "—", description: "Optional file name or short label rendered above the code." },
  { name: "showLineNumbers", type: "boolean", defaultValue: "false", description: "Adds a line-number column for multi-line code." },
  { name: "highlightLines", type: "number[]", defaultValue: "[]", description: "1-indexed lines to emphasize." },
  { name: "showCopyButton", type: "boolean", defaultValue: "false", description: "Shows the copy button; always visible on single-line blocks." },
  { name: "wrap", type: "boolean", defaultValue: "false", description: "Wraps long lines to fit the block. Line numbers stay aligned with source lines." },
  { name: "collapsible", type: "boolean", defaultValue: "false", description: "Shows a preview with Expand code / Collapse code controls when the content exceeds collapsedLines." },
  { name: "collapsedLines", type: "number", defaultValue: "10", description: "Visible rows in the collapsed preview, including wrapped rows. Values are rounded down, with a minimum of 1; non-finite values use 10." },
  { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial expanded state of a collapsible block." },
  { name: "open", type: "boolean", defaultValue: "—", description: "Controlled expanded state; use v-model:open." },
  { name: "expandLabel", type: "string", defaultValue: "Expand code", description: "Text and accessible name of the expand control." },
  { name: "collapseLabel", type: "string", defaultValue: "Collapse code", description: "Text and accessible name of the collapse control." },
  { name: "labels", type: "CodeBlockLabels", defaultValue: "provider", description: "Overrides provider labels for this block." },
] as const;

export const exportsList = [
  { name: "CodeBlock", description: "Compound API exposing Root and Provider." },
  { name: "CodeBlockRoot", description: "Unaugmented code display component." },
  { name: "ShikiProvider", description: "Lazy-loads one shared Shiki highlighter for all child blocks." },
  { name: "useShikiHighlighter", description: "Access highlight, loading state, and labels inside a provider." },
  { name: "normalizeCodeBlockLanguage", description: "Resolves aliases to supported language ids." },
  { name: "DEFAULT_CODE_BLOCK_LABELS", description: "Default copy-button and language-selector labels." },
  { name: "CodeBlockLabels", description: "Copy-button and language-selector label overrides." },
  { name: "CodeBlockEmits", description: "Events, including update:lang for language selection." },
  { name: "CodeBlockLanguageOption", description: "A language choice with a label and value." },
  { name: "CodeBlockProps", description: "Public component props." },
  { name: "LanguageAlias", description: "Supported shorthand language ids." },
  { name: "LanguageInput", description: "Supported language ids and aliases." },
  { name: "ShikiEngine", description: "Supported Shiki engine names." },
  { name: "ShikiProviderProps", description: "Provider props." },
  { name: "SupportedLanguage", description: "Languages available through the dedicated entry point." },
  { name: "UseShikiHighlighterResult", description: "Return type of useShikiHighlighter." },
] as const;
