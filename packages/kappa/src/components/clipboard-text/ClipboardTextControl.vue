<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { ClipboardTextControlProps, ClipboardTextControlSlots } from "./clipboard-text";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<ClipboardTextControlProps>(), {
  asChild: undefined,
});

defineSlots<ClipboardTextControlSlots>();
</script>

<template>
  <ArkClipboard.Control
    v-bind="$attrs"
    class="kappa-clipboard-text__control"
    data-slot="clipboard-text-control"
    :as-child="asChild"
  >
    <slot />
  </ArkClipboard.Control>
</template>
