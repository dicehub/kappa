<script setup lang="ts">
import { CodeHighlighted, ShikiProvider } from "@dicehub/kappa/components/code-highlighted";

type DemoVariant =
  | "preview"
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

const previewCode = `// Clamp the Courant number before each iteration
const courant = computed(() => Math.min(rawCourant.value, 5));

watch(courant, (value) => {
  solver.setMaxCourant(value);
});`;

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
    code: `.kappa-code-highlighted {
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
  <div class="code-highlighted-demo" :data-code-highlighted-demo="variant">
    <ShikiProvider v-if="variant === 'preview'" :languages="['typescript']">
      <CodeHighlighted
        title="courant-limit.ts"
        :code="previewCode"
        lang="typescript"
        show-copy-button
      />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'usage'" :languages="['typescript']">
      <CodeHighlighted :code="usageCode" lang="typescript" />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'title'" :languages="['typescript']">
      <CodeHighlighted
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
      <div class="code-highlighted-demo__languages">
        <figure v-for="example in languageExamples" :key="example.lang" class="code-highlighted-demo__language">
          <figcaption class="code-highlighted-demo__caption">{{ example.title }}</figcaption>
          <CodeHighlighted :code="example.code" :lang="example.lang" />
        </figure>
      </div>
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'highlight-lines'" :languages="['typescript']">
      <CodeHighlighted :code="highlightLinesCode" lang="typescript" :highlight-lines="[3]" />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'highlight-color'" :languages="['typescript']">
      <CodeHighlighted
        class="code-highlighted-demo__accent-lines"
        :code="highlightLinesCode"
        lang="typescript"
        :highlight-lines="[3]"
      />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'line-numbers'" :languages="['typescript']">
      <CodeHighlighted :code="lineNumbersCode" lang="typescript" show-line-numbers />
    </ShikiProvider>

    <ShikiProvider v-else-if="variant === 'copy-button'" :languages="['bash']">
      <CodeHighlighted code="pnpm add @dicehub/kappa" lang="bash" show-copy-button />
    </ShikiProvider>

    <ShikiProvider
      v-else
      :languages="['typescript']"
      :labels="{ copy: 'Kopieren', copied: 'Kopiert!' }"
    >
      <CodeHighlighted :code="usageCode" lang="typescript" show-copy-button />
    </ShikiProvider>
  </div>
</template>

<style scoped>
.code-highlighted-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  min-height: 4rem;
  align-items: start;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.code-highlighted-demo > * {
  width: 100%;
  min-width: 0;
}

.code-highlighted-demo__languages {
  display: grid;
  gap: 1rem;
}

.code-highlighted-demo__language {
  display: grid;
  margin: 0;
  gap: 0.375rem;
}

.code-highlighted-demo__caption {
  color: var(--docs-subtle);
  font-size: 0.75rem;
  font-weight: 600;
}

.code-highlighted-demo__accent-lines {
  --kappa-code-highlight-bg: color-mix(in oklab, var(--kappa-accent, #4356e8) 14%, transparent);
}
</style>
