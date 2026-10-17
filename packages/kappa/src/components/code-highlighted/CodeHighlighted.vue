<script setup lang="ts">
import { computed, type VNodeChild } from "vue";
import { Select } from "../select";
import CodeHighlightedCopy from "./CodeHighlightedCopy.vue";
import CodeBlockDisclosure from "./CodeBlockDisclosure.vue";
import type { CodeHighlightedEmits, CodeHighlightedProps } from "./code-highlighted";
import { useOptionalShikiHighlighter } from "./use-shiki-highlighter";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CodeHighlightedProps>(), {
  lang: "text",
  highlightLines: () => [],
  labels: () => ({}),
  languageOptions: () => [],
  showCopyButton: false,
  showLineNumbers: false,
  wrap: false,
  collapsible: false,
  collapsedLines: 10,
  defaultOpen: false,
  open: undefined,
  expandLabel: "Expand code",
  collapseLabel: "Collapse code",
});

const emit = defineEmits<CodeHighlightedEmits>();
const slots = defineSlots<{
  title?: () => VNodeChild;
  actions?: () => VNodeChild;
}>();

const highlighter = useOptionalShikiHighlighter();

const labels = computed(() => ({ ...highlighter.labels.value, ...props.labels }));
const lines = computed(() => props.code.split("\n"));
const isSingleLine = computed(() => lines.value.length === 1);
const hasHeader = computed(() => Boolean(props.title || slots.title || props.languageOptions.length || slots.actions));
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
  if (!html) return html;

  const highlightSet = new Set(highlightLines);
  let lineNumber = 0;

  return html.replace(/<span class="line"><\/span>/g, '<span class="line"><br></span>')
    .replace(/<span class="line">/g, () => {
      lineNumber += 1;
      const className = highlightSet.has(lineNumber) ? "line line-highlighted" : "line";
      const number = showLineNumbersColumn.value
        ? `<span class="kappa-code-highlighted__line-number" data-slot="code-block-line-number" aria-hidden="true">${lineNumber}</span>`
        : "";
      return `<span class="${className}">${number}`;
    });
}
</script>

<template>
  <CodeBlockDisclosure
    v-bind="$attrs"
    :collapsible="collapsible"
    :collapsed-lines="collapsedLines"
    :default-open="defaultOpen"
    :open="open"
    :expand-label="expandLabel"
    :collapse-label="collapseLabel"
    @update:open="emit('update:open', $event)"
    @open-change="emit('openChange', $event)"
    class="kappa-code-highlighted kappa-code-block"
    data-slot="code-highlighted"
    :data-wrap="wrap || undefined"
    :style="{ '--kappa-code-line-number-width': `${String(lines.length).length + 2}ch` }"
    :class="{
      'kappa-code-highlighted--has-copy': showCopyButton,
      'kappa-code-highlighted--single-line': showCopyButton && isSingleLine && !hasHeader,
      'kappa-code-highlighted--with-title': title,
      'kappa-code-highlighted--with-header': hasHeader,
      'kappa-code-highlighted--numbered': showLineNumbersColumn,
    }"
  >
    <template #header>
      <figcaption v-if="hasHeader" class="kappa-code-highlighted__header">
        <span v-if="title || $slots.title" class="kappa-code-highlighted__title"><slot name="title">{{ title }}</slot></span>
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
        <div v-if="$slots.actions" class="kappa-code-highlighted__actions"><slot name="actions" /></div>
        <CodeHighlightedCopy v-if="showCopyButton" :code="code" :labels="labels" />
      </figcaption>
    </template>

    <template #default="{ open: codeOpen }">
      <div
        class="kappa-code-highlighted__scroll"
        role="region"
        :aria-label="title || 'Code block'"
        :tabindex="codeOpen ? 0 : -1"
        dir="ltr"
      >
        <div
          v-if="processedHtml"
          class="kappa-code-highlighted__shiki"
          v-html="processedHtml"
        />
        <pre v-else class="kappa-code-highlighted__plain"><code><span
          v-for="(line, index) in lines"
          :key="index"
          class="line"
          :class="{ 'line-highlighted': highlightLines.includes(index + 1) }"
        ><span
            v-if="showLineNumbersColumn"
            class="kappa-code-highlighted__line-number"
            data-slot="code-block-line-number"
            aria-hidden="true"
          >{{ index + 1 }}</span>{{ line }}<br v-if="!line" /></span></code></pre>
      </div>
    </template>

    <template #copy>
      <CodeHighlightedCopy v-if="showCopyButton && !hasHeader" :code="code" :labels="labels" />
    </template>
  </CodeBlockDisclosure>
</template>

<style src="./code-highlighted.css"></style>
<style src="./code-block-disclosure.css"></style>
