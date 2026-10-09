<script setup lang="ts">
import { computed } from "vue";
import { Select } from "../select";
import CodeHighlightedCopy from "./CodeHighlightedCopy.vue";
import type { CodeHighlightedEmits, CodeHighlightedProps } from "./code-highlighted";
import { useShikiHighlighter } from "./use-shiki-highlighter";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CodeHighlightedProps>(), {
  highlightLines: () => [],
  labels: () => ({}),
  languageOptions: () => [],
  showCopyButton: false,
  showLineNumbers: false,
});

const emit = defineEmits<CodeHighlightedEmits>();

const highlighter = useShikiHighlighter();

const labels = computed(() => ({ ...highlighter.labels.value, ...props.labels }));
const lines = computed(() => props.code.split("\n"));
const isSingleLine = computed(() => lines.value.length === 1);
const hasHeader = computed(() => Boolean(props.title || props.languageOptions.length));
const highlightedHtml = computed(() =>
  highlighter.isLoading.value || highlighter.error.value
    ? null
    : highlighter.highlight(props.code, props.lang),
);
const processedHtml = computed(() => processHighlightedHtml(highlightedHtml.value, props.highlightLines));
const showLineNumbersColumn = computed(() => props.showLineNumbers && !isSingleLine.value);

function selectLanguage(value: string[]): void {
  const language = value[0];
  if (language && language !== props.lang) emit("update:lang", language);
}

function processHighlightedHtml(html: string | null, highlightLines: number[]): string | null {
  if (!html || highlightLines.length === 0) return html;

  const highlightSet = new Set(highlightLines);
  let lineNumber = 0;

  return html.replace(/<span class="line">/g, () => {
    lineNumber += 1;
    return highlightSet.has(lineNumber) ? '<span class="line line-highlighted">' : '<span class="line">';
  });
}
</script>

<template>
  <figure
    v-bind="$attrs"
    class="kappa-code-highlighted"
    data-slot="code-highlighted"
    :class="{
      'kappa-code-highlighted--has-copy': showCopyButton,
      'kappa-code-highlighted--single-line': showCopyButton && isSingleLine && !hasHeader,
      'kappa-code-highlighted--with-title': title,
      'kappa-code-highlighted--with-header': hasHeader,
    }"
  >
    <figcaption v-if="hasHeader" class="kappa-code-highlighted__header">
      <span v-if="title" class="kappa-code-highlighted__title">{{ title }}</span>
      <Select.Root
        v-if="languageOptions.length"
        class="kappa-code-highlighted__language-select"
        :aria-label="labels.language"
        :items="languageOptions"
        :model-value="[lang]"
        :positioning="{ placement: 'bottom-end', gutter: 4, sameWidth: false }"
        size="sm"
        @update:model-value="selectLanguage"
      >
        <Select.Control>
          <Select.Trigger class="kappa-code-highlighted__language-trigger">
            <Select.ValueText />
            <Select.Indicator />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content class="kappa-code-highlighted__language-menu" :aria-label="labels.language">
            <Select.Item v-for="option in languageOptions" :key="option.value" :item="option">
              {{ option.label }}
            </Select.Item>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      <CodeHighlightedCopy v-if="showCopyButton" :code="code" :labels="labels" />
    </figcaption>

    <div v-if="showLineNumbersColumn" class="kappa-code-highlighted__layout">
      <div class="kappa-code-highlighted__line-numbers" aria-hidden="true">
        <span v-for="(_, index) in lines" :key="index">{{ index + 1 }}</span>
      </div>
      <div class="kappa-code-highlighted__scroll">
        <div
          v-if="processedHtml"
          class="kappa-code-highlighted__shiki"
          v-html="processedHtml"
        />
        <pre v-else class="kappa-code-highlighted__plain"><code>{{ code }}</code></pre>
      </div>
    </div>

    <div v-else class="kappa-code-highlighted__scroll">
      <div
        v-if="processedHtml"
        class="kappa-code-highlighted__shiki"
        v-html="processedHtml"
      />
      <pre v-else class="kappa-code-highlighted__plain"><code>{{ code }}</code></pre>
    </div>

    <CodeHighlightedCopy v-if="showCopyButton && !hasHeader" :code="code" :labels="labels" />
  </figure>
</template>

<style src="./code-highlighted.css"></style>
