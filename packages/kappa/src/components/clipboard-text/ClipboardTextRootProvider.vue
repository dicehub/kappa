<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { ClipboardTextRootProviderProps, ClipboardTextRootProviderSlots } from "./clipboard-text";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<ClipboardTextRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<ClipboardTextRootProviderSlots>();
</script>

<template>
  <ArkClipboard.RootProvider
    v-bind="$attrs"
    class="kappa-clipboard-text"
    data-slot="clipboard-text"
    :as-child="asChild"
    :value="value"
  >
    <slot />
  </ArkClipboard.RootProvider>
</template>

<style src="./clipboard-text.css"></style>
