<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import AutocompleteItemIndicator from "./AutocompleteItemIndicator.vue";
import AutocompleteItemText from "./AutocompleteItemText.vue";
import type { AutocompleteItemProps } from "./autocomplete";

defineOptions({ inheritAttrs: false });

const props = defineProps<AutocompleteItemProps>();
const resolvedItem = computed(() => props.item ?? props.value);
const hasResolvedItem = computed(() => resolvedItem.value != null);
</script>

<template>
  <Combobox.Item
    v-if="hasResolvedItem"
    v-bind="$attrs"
    class="kappa-autocomplete__item"
    :item="resolvedItem"
  >
    <slot name="before" />
    <AutocompleteItemText>
      <slot name="text">
        <slot />
      </slot>
    </AutocompleteItemText>
    <slot name="indicator">
      <AutocompleteItemIndicator />
    </slot>
  </Combobox.Item>
</template>
