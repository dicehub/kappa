<script setup lang="ts">
import { useClipboard, type ClipboardCopyStatusDetails } from "@ark-ui/vue/clipboard";
import { computed, mergeProps } from "vue";
import { Tooltip } from "../tooltip";
import type { InlineCopyTextEmits, InlineCopyTextProps, InlineCopyTextSlots } from "./inline-copy-text";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InlineCopyTextProps>(), {
  bold: false,
  copiedLabel: "Copied",
  copyLabel: "Copy to clipboard",
  disabled: false,
  iconVisibility: "hover",
  size: "sm",
  timeout: 3000,
  truncate: false,
  variant: "mono-secondary",
});

const emit = defineEmits<InlineCopyTextEmits>();
defineSlots<InlineCopyTextSlots>();

const clipboard = useClipboard(computed(() => ({
  modelValue: props.value,
  timeout: props.timeout,
  onStatusChange: (details: ClipboardCopyStatusDetails) => emit("statusChange", details),
})));
</script>

<template>
  <Tooltip.Root lazy-mount :disabled="props.disabled" :close-on-click="false" :close-on-pointer-down="false">
    <Tooltip.Trigger as-child>
      <button
        v-bind="mergeProps({ ...clipboard.getTriggerProps(), 'aria-label': undefined }, $attrs)"
        class="kappa-inline-copy-text"
        :class="{
          'kappa-inline-copy-text--bold': props.bold,
          'kappa-inline-copy-text--truncate': props.truncate,
        }"
        data-slot="inline-copy-text"
        :data-variant="props.variant"
        :data-size="props.size"
        :data-icon-visibility="props.iconVisibility"
        :disabled="props.disabled"
        type="button"
      >
        <span class="kappa-inline-copy-text__action">{{ clipboard.copied ? props.copiedLabel : props.copyLabel }}: </span>
        <span class="kappa-inline-copy-text__text" data-slot="inline-copy-text-value">
          <slot>{{ props.value }}</slot>
        </span>
        <span class="kappa-inline-copy-text__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" focusable="false">
            <path
              v-if="clipboard.copied"
              d="m3 8 3 3 7-7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g v-else transform="translate(16 0) scale(-1 1)">
              <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" />
              <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" stroke-width="1.5" />
            </g>
          </svg>
        </span>
      </button>
    </Tooltip.Trigger>
    <Tooltip.Content :lang="typeof $attrs.lang === 'string' ? $attrs.lang : undefined">
      {{ clipboard.copied ? props.copiedLabel : props.copyLabel }}
    </Tooltip.Content>
    <span
      class="kappa-inline-copy-text__status"
      role="status"
      aria-atomic="true"
      :lang="typeof $attrs.lang === 'string' ? $attrs.lang : undefined"
    >
      {{ clipboard.copied ? props.copiedLabel : "" }}
    </span>
  </Tooltip.Root>
</template>

<style src="./inline-copy-text.css"></style>
