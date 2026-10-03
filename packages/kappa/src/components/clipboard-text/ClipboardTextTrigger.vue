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
