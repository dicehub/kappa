<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { ClipboardTextLabelProps, ClipboardTextLabelSlots } from "./clipboard-text";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<ClipboardTextLabelProps>(), {
  asChild: undefined,
});

defineSlots<ClipboardTextLabelSlots>();
</script>

<template>
  <ArkClipboard.Label
    v-bind="$attrs"
    class="kappa-clipboard-text__label"
    data-slot="clipboard-text-label"
    :as-child="asChild"
  >
    <slot />
  </ArkClipboard.Label>
</template>
