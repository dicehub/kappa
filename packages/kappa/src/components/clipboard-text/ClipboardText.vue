<script setup lang="ts">
import { Clipboard as ArkClipboard } from "@ark-ui/vue/clipboard";
import type { ClipboardTextEmits, ClipboardTextProps, ClipboardTextSlots } from "./clipboard-text";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ClipboardTextProps>(), {
  asChild: undefined,
  defaultValue: undefined,
  id: undefined,
  ids: undefined,
  modelValue: undefined,
  timeout: undefined,
  translations: undefined,
});

const emit = defineEmits<ClipboardTextEmits>();
defineSlots<ClipboardTextSlots>();
</script>

<template>
  <ArkClipboard.Root
    v-bind="$attrs"
    class="kappa-clipboard-text"
    data-slot="clipboard-text"
    :as-child="props.asChild"
    :default-value="props.defaultValue"
    :id="props.id"
    :ids="props.ids"
    :model-value="props.modelValue"
    :timeout="props.timeout"
    :translations="props.translations"
    @status-change="emit('statusChange', $event)"
    @update:model-value="emit('update:modelValue', $event)"
    @value-change="emit('valueChange', $event)"
  >
    <slot />
  </ArkClipboard.Root>
</template>

<style src="./clipboard-text.css"></style>
