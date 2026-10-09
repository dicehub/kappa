<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { CodeHighlightedLabels } from "./code-highlighted";

defineProps<{ code: string; labels: Required<CodeHighlightedLabels> }>();
</script>

<template>
  <ArkClipboard.Root
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
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="3" y="8" width="13" height="13" rx="3" />
          <path d="M8 8V6a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-2" />
        </svg>
      </ArkClipboard.Trigger>
      <span class="kappa-code-highlighted__copy-status" aria-live="polite" aria-atomic="true">
        {{ clipboard.copied ? labels.copied : "" }}
      </span>
    </ArkClipboard.Context>
  </ArkClipboard.Root>
</template>
