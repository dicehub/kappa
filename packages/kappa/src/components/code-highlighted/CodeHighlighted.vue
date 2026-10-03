<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import { computed } from "vue";
import type { CodeHighlightedProps } from "./code-highlighted";
import { useShikiHighlighter } from "./use-shiki-highlighter";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CodeHighlightedProps>(), {
  highlightLines: () => [],
  labels: () => ({}),
  showCopyButton: false,
  showLineNumbers: false,
});

const highlighter = useShikiHighlighter();

const labels = computed(() => ({ ...highlighter.labels.value, ...props.labels }));
const lines = computed(() => props.code.split("\n"));
const isSingleLine = computed(() => lines.value.length === 1);
const highlightedHtml = computed(() =>
  highlighter.isLoading.value || highlighter.error.value
    ? null
    : highlighter.highlight(props.code, props.lang),
);
const processedHtml = computed(() => processHighlightedHtml(highlightedHtml.value, props.highlightLines));
const showLineNumbersColumn = computed(() => props.showLineNumbers && !isSingleLine.value);

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
      'kappa-code-highlighted--single-line': showCopyButton && isSingleLine && !title,
      'kappa-code-highlighted--with-title': title,
    }"
  >
    <figcaption v-if="title" class="kappa-code-highlighted__header">
      <span class="kappa-code-highlighted__title">{{ title }}</span>
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

    <ArkClipboard.Root
      v-if="showCopyButton"
      class="kappa-code-highlighted__copy-root"
      data-slot="code-highlighted-copy"
      :model-value="code"
      :timeout="2000"
    >
      <ArkClipboard.Context v-slot="clipboard">
        <ArkClipboard.Trigger
          type="button"
          class="kappa-code-highlighted__copy"
          :aria-label="clipboard.copied ? labels.copied : labels.copy"
        >
          <svg
            v-if="clipboard.copied"
            class="kappa-code-highlighted__copy-icon"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M3.25 8.75 6.25 11.5 12.75 4.5"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else
            class="kappa-code-highlighted__copy-icon"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <path
              d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
        </ArkClipboard.Trigger>
        <span
          class="kappa-code-highlighted__copy-status"
          aria-live="polite"
          aria-atomic="true"
        >
          {{ clipboard.copied ? labels.copied : "" }}
        </span>
      </ArkClipboard.Context>
    </ArkClipboard.Root>
  </figure>
</template>

<style src="./code-highlighted.css"></style>
