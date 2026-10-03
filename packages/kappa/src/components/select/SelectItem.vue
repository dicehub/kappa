<script setup lang="ts">
import { Select as ArkSelect, useSelectContext } from "@ark-ui/vue/select";
import { computed } from "vue";
import SelectItemIndicator from "./SelectItemIndicator.vue";
import SelectItemText from "./SelectItemText.vue";
import type { SelectItemProps, SelectItemSlots } from "./select";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectItemProps>(), {
  asChild: undefined,
  item: undefined,
  persistFocus: undefined,
  value: undefined,
});

defineSlots<SelectItemSlots>();

const select = useSelectContext();
const resolvedItem = computed(() => {
  if (props.item !== undefined) return props.item;
  if (props.value !== undefined) {
    return select.value.collection.find(String(props.value)) ?? props.value;
  }
  return undefined;
});
</script>

<template>
  <ArkSelect.Item
    v-if="resolvedItem !== undefined"
    v-bind="$attrs"
    class="kappa-select__item"
    data-slot="select-item"
    :as-child="props.asChild"
    :item="resolvedItem"
    :persist-focus="props.persistFocus"
  >
    <slot v-if="props.asChild" />
    <template v-else>
      <slot name="before" />
      <SelectItemText>
        <slot name="text"><slot /></slot>
      </SelectItemText>
      <slot name="after" />
      <slot name="indicator">
        <SelectItemIndicator />
      </slot>
    </template>
  </ArkSelect.Item>
</template>

<style src="./select.css"></style>
