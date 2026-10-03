<script setup lang="ts">
import { Listbox as ArkListbox, type CollectionItem } from "@ark-ui/vue/listbox";
import { computed } from "vue";
import {
  SELECTION_LIST_DEFAULT_SIZE,
  resolveSelectionListSize,
  type SelectionListEmits,
  type SelectionListRootProps,
  type SelectionListRootSlots,
} from "./selection-list";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectionListRootProps<CollectionItem>>(), {
  asChild: undefined,
  defaultHighlightedValue: undefined,
  defaultValue: undefined,
  deselectable: undefined,
  disabled: undefined,
  disallowSelectAll: undefined,
  highlightedValue: undefined,
  id: undefined,
  ids: undefined,
  loopFocus: undefined,
  modelValue: undefined,
  orientation: undefined,
  scrollToIndexFn: undefined,
  selectOnHighlight: undefined,
  selectionMode: undefined,
  size: SELECTION_LIST_DEFAULT_SIZE,
  typeahead: undefined,
});

const emit = defineEmits<SelectionListEmits<CollectionItem>>();
defineSlots<SelectionListRootSlots>();

const resolvedSize = computed(() => resolveSelectionListSize(props.size));
</script>

<template>
  <ArkListbox.Root
    v-bind="$attrs"
    class="kappa-selection-list"
    data-slot="selection-list"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :collection="props.collection"
    :default-highlighted-value="props.defaultHighlightedValue"
    :default-value="props.defaultValue"
    :deselectable="props.deselectable"
    :disabled="props.disabled"
    :disallow-select-all="props.disallowSelectAll"
    :highlighted-value="props.highlightedValue"
    :id="props.id"
    :ids="props.ids"
    :loop-focus="props.loopFocus"
    :model-value="props.modelValue"
    :orientation="props.orientation"
    :scroll-to-index-fn="props.scrollToIndexFn"
    :select-on-highlight="props.selectOnHighlight"
    :selection-mode="props.selectionMode"
    :typeahead="props.typeahead"
    @highlight-change="emit('highlightChange', $event)"
    @select="emit('select', $event)"
    @value-change="emit('valueChange', $event)"
    @update:highlighted-value="emit('update:highlightedValue', $event)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </ArkListbox.Root>
</template>

<style src="./selection-list.css"></style>
