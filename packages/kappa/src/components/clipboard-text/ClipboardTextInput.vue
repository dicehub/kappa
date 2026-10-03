<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { ClipboardTextInputProps, ClipboardTextInputSlots } from "./clipboard-text";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<ClipboardTextInputProps>(), {
  asChild: undefined,
});

defineSlots<ClipboardTextInputSlots>();
</script>

<template>
  <ArkClipboard.Input
    v-bind="$attrs"
    class="kappa-clipboard-text__input"
    data-slot="clipboard-text-input"
    :as-child="asChild"
  >
    <slot />
  </ArkClipboard.Input>
</template>
