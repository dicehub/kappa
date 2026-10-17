<script setup lang="ts">
import { CodeBlock, ShikiProvider } from "@dicehub/kappa/components/code-block";
import LanguageSwitch from "../snippets/code-block/LanguageSwitch.vue";
import NumberedLanguageSwitch from "../snippets/code-block/NumberedLanguageSwitch.vue";
import TabbedExamples from "../snippets/code-block/TabbedExamples.vue";
import FileTabs from "../snippets/code-block/FileTabs.vue";
import WrapLines from "../snippets/code-block/WrapLines.vue";
import CollapsibleCode from "../snippets/code-block/CollapsibleCode.vue";
import PlainText from "../snippets/code-block/PlainText.vue";
import Header from "../snippets/code-block/Header.vue";
import Actions from "../snippets/code-block/Actions.vue";

type DemoVariant =
  | "preview"
  | "language-switch"
  | "tabbed-examples"
  | "file-tabs"
  | "wrap"
  | "collapsible"
  | "plain-text"
  | "header"
  | "actions"
  | "usage"
  | "title"
  | "languages"
  | "highlight-lines"
  | "highlight-color"
  | "line-numbers"
  | "copy-button"
  | "labels";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const usageCode = `interface BoundaryPatch {
  name: string;
  type: "inlet" | "outlet" | "wall";
  faces: number;
}`;

const languageExamples = [
  {
    title: "TypeScript",
    lang: "typescript",
    code: `async function fetchRun(id: string): Promise<SimulationRun> {
  const response = await fetch(\`/api/runs/\${id}\`);
  return response.json();
}`,
  },
  {
    title: "Vue",
    lang: "vue",
    code: `<scr` + `ipt setup lang="ts">
const cells = ref(2_400_000);
</scr` + `ipt>

<template>
  <span>{{ cells }} cells</span>
</template>`,
  },
  {
    title: "Bash",
    lang: "bash",
    code: `# Build the library and run the docs
pnpm --filter @dicehub/kappa build
pnpm dev`,
  },
  {
    title: "JSON",
    lang: "json",
    code: `{
  "solver": "pimpleFoam",
  "correctors": 6,
  "adaptive": true
}`,
  },
  {
    title: "CSS",
    lang: "css",
    code: `.kappa-code-block {
  border: 1px solid var(--kappa-line);
  border-radius: 0.5rem;
}`,
  },
];

const highlightLinesCode = `function decompose(mesh: Mesh, partitions: number) {
  const regions = mesh.split(partitions);
  const balanced = balance(regions);
  return balanced.map(assignWeights);
}`;

const lineNumbersCode = `import { computed, watch } from "vue";

export function useCourantLimit(raw: Ref<number>) {
  const clamped = computed(() => Math.min(raw.value, 5));

  watch(clamped, (value) => {
    solver.setMaxCourant(value);
  });

  return clamped;
}`;
</script>

<template>
  <div class="code-block-demo" :data-code-block-demo="variant">
    <LanguageSwitch v-if="variant === 'preview'" />

    <NumberedLanguageSwitch v-else-if="variant === 'language-switch'" />

    <TabbedExamples v-else-if="variant === 'tabbed-examples'" />
    <FileTabs v-else-if="variant === 'file-tabs'" />
    <WrapLines v-else-if="variant === 'wrap'" />
    <CollapsibleCode v-else-if="variant === 'collapsible'" />
    <PlainText v-else-if="variant === 'plain-text'" />
    <Header v-else-if="variant === 'header'" />
    <Actions v-else-if="variant === 'actions'" />

    <ShikiProvider v-else-if="variant === 'usage'" :languages="['typescript']">
      <CodeBlock :code="usageCode" lang="typescript" />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'title'" :languages="['typescript']">
      <CodeBlock
        title="mesh-partition.ts"
        :code="highlightLinesCode"
        lang="typescript"
        show-copy-button
      />
    </ShikiProvider>

    <ShikiProvider
      v-else-if="variant === 'languages'"
      :languages="['typescript', 'vue', 'bash', 'json', 'css']"
    >
      <div class="code-block-demo__languages">
        <figure v-for="example in languageExamples" :key="example.lang" class="code-block-demo__language">
          <figcaption class="code-block-demo__caption">{{ example.title }}</figcaption>
          <CodeBlock :code="example.code" :lang="example.lang" />
        </figure>
      </div>
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'highlight-lines'" :languages="['typescript']">
      <CodeBlock :code="highlightLinesCode" lang="typescript" :highlight-lines="[3]" />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'highlight-color'" :languages="['typescript']">
      <CodeBlock
        class="code-block-demo__accent-lines"
        :code="highlightLinesCode"
        lang="typescript"
        :highlight-lines="[3]"
      />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'line-numbers'" :languages="['typescript']">
      <CodeBlock :code="lineNumbersCode" lang="typescript" show-line-numbers />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'copy-button'" :languages="['bash']">
      <CodeBlock code="pnpm add @dicehub/kappa" lang="bash" show-copy-button />
    </ShikiProvider>

    <ShikiProvider
      v-else
      :languages="['typescript']"
      :labels="{ copy: 'Kopieren', copied: 'Kopiert!' }"
    >
      <CodeBlock :code="usageCode" lang="typescript" show-copy-button />
    </ShikiProvider>
  </div>
</template>

<style scoped>
.code-block-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  min-height: 4rem;
  align-items: start;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.code-block-demo > * {
  width: 100%;
  min-width: 0;
}

.code-block-demo__languages {
  display: grid;
  gap: 1rem;
}

.code-block-demo__language {
  display: grid;
  margin: 0;
  gap: 0.375rem;
}

.code-block-demo__caption {
  color: var(--docs-subtle);
  font-size: 0.75rem;
  font-weight: 600;
}

.code-block-demo__accent-lines {
  --kappa-code-highlight-bg: color-mix(in oklab, var(--kappa-accent, #4356e8) 14%, transparent);
}
</style>
