<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { ClipboardTextContextSlots } from "./clipboard-text";

defineSlots<ClipboardTextContextSlots>();
</script>

<template>
  <ArkClipboard.Context v-slot="context">
    <slot v-bind="context" />
  </ArkClipboard.Context>
</template>
