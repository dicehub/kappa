<script setup lang="ts">
import { Listbox as ArkListbox, type CollectionItem } from "@ark-ui/vue/listbox";
import { computed } from "vue";
import {
  SELECTION_LIST_DEFAULT_SIZE,
  resolveSelectionListSize,
  type SelectionListRootProviderProps,
  type SelectionListRootProviderSlots,
} from "./selection-list";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<SelectionListRootProviderProps<CollectionItem>>(),
  { asChild: undefined, size: SELECTION_LIST_DEFAULT_SIZE },
);
defineSlots<SelectionListRootProviderSlots>();

const resolvedSize = computed(() => resolveSelectionListSize(props.size));
</script>

<template>
  <ArkListbox.RootProvider
    v-bind="$attrs"
    class="kappa-selection-list"
    data-slot="selection-list"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkListbox.RootProvider>
</template>

<style src="./selection-list.css"></style>
