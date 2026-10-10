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
          <svg v-if="clipboard.copied" viewBox="0 0 16 16" fill="none" focusable="false">
            <path
              d="m3 8 3 3 7-7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" focusable="false">
            <rect x="3" y="8" width="13" height="13" rx="3" />
            <path d="M8 8V6a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-2" />
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
