<script setup lang="ts">
import { Splitter as ArkSplitter } from "@ark-ui/vue/splitter";
import { computed } from "vue";
import {
  RESIZABLE_DEFAULT_ORIENTATION,
  resolveResizableOrientation,
  type ResizableEmits,
  type ResizableProps,
  type ResizableRootSlots,
} from "./resizable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ResizableProps>(), {
  asChild: undefined,
  defaultSize: undefined,
  id: undefined,
  ids: undefined,
  keyboardResizeBy: undefined,
  nonce: undefined,
  orientation: RESIZABLE_DEFAULT_ORIENTATION,
  registry: undefined,
  size: undefined,
});

const emit = defineEmits<ResizableEmits>();
defineSlots<ResizableRootSlots>();

const resolvedOrientation = computed(() =>
  resolveResizableOrientation(props.orientation),
);
</script>

<template>
  <ArkSplitter.Root
    v-bind="$attrs"
    class="kappa-resizable"
    data-slot="resizable"
    :as-child="props.asChild"
    :default-size="props.defaultSize"
    :id="props.id"
    :ids="props.ids"
    :keyboard-resize-by="props.keyboardResizeBy"
    :nonce="props.nonce"
    :orientation="resolvedOrientation"
    :panels="props.panels"
    :registry="props.registry"
    :size="props.size"
    @collapse="emit('collapse', $event)"
    @expand="emit('expand', $event)"
    @resize="emit('resize', $event)"
    @resize-end="emit('resizeEnd', $event)"
    @resize-start="emit('resizeStart')"
    @update:size="emit('update:size', $event)"
  >
    <slot />
  </ArkSplitter.Root>
</template>

<style src="./resizable.css"></style>
