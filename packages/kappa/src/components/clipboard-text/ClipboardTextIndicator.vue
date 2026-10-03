<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { ClipboardTextIndicatorProps, ClipboardTextIndicatorSlots } from "./clipboard-text";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<ClipboardTextIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<ClipboardTextIndicatorSlots>();
</script>

<template>
  <ArkClipboard.Indicator
    v-bind="$attrs"
    class="kappa-clipboard-text__indicator"
    data-slot="clipboard-text-indicator"
    :as-child="asChild"
  >
    <template #default>
      <slot />
    </template>
    <template #copied>
      <slot name="copied" />
    </template>
  </ArkClipboard.Indicator>
</template>
