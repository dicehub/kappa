<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import ClipboardTextIndicator from "./ClipboardTextIndicator.vue";
import type { ClipboardTextTriggerProps, ClipboardTextTriggerSlots } from "./clipboard-text";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<ClipboardTextTriggerProps>(), {
  asChild: undefined,
});

defineSlots<ClipboardTextTriggerSlots>();
</script>

<template>
  <ArkClipboard.Trigger
    v-bind="$attrs"
    class="kappa-clipboard-text__trigger"
    data-slot="clipboard-text-trigger"
    :as-child="asChild"
  >
    <slot>
      <ClipboardTextIndicator>
        <svg
          class="kappa-clipboard-text__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="3" y="8" width="13" height="13" rx="3" />
          <path
            d="M8 8V6a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-2"
          />
        </svg>
        <template #copied>
          <svg
            class="kappa-clipboard-text__icon kappa-clipboard-text__icon--copied"
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
        </template>
      </ClipboardTextIndicator>
    </slot>
  </ArkClipboard.Trigger>
</template>

<style src="./clipboard-text.css"></style>
