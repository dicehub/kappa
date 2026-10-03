<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import type { ComboboxItemProps } from "./combobox";
import ComboboxItemIndicator from "./ComboboxItemIndicator.vue";
import ComboboxItemText from "./ComboboxItemText.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<ComboboxItemProps>();
const resolvedItem = computed(() => props.item ?? props.value);
const hasResolvedItem = computed(() => resolvedItem.value != null);
</script>

<template>
  <Combobox.Item
    v-if="hasResolvedItem"
    v-bind="$attrs"
    class="kappa-combobox__item"
    :item="resolvedItem"
    data-slot="combobox-item"
  >
    <slot name="before" />
    <ComboboxItemText>
      <slot name="text"><slot /></slot>
    </ComboboxItemText>
    <slot name="indicator"><ComboboxItemIndicator /></slot>
  </Combobox.Item>
</template>
