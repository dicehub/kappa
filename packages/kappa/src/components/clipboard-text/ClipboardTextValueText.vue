<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { ClipboardTextValueTextProps, ClipboardTextValueTextSlots } from "./clipboard-text";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<ClipboardTextValueTextProps>(), {
  asChild: undefined,
});

defineSlots<ClipboardTextValueTextSlots>();
</script>

<template>
  <ArkClipboard.ValueText
    v-bind="$attrs"
    class="kappa-clipboard-text__value-text"
    data-slot="clipboard-text-value-text"
    :as-child="asChild"
  >
    <slot />
  </ArkClipboard.ValueText>
</template>
