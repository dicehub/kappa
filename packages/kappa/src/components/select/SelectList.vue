<script setup lang="ts">
import { Select as ArkSelect, useSelectContext } from "@ark-ui/vue/select";
import { computed } from "vue";
import type { SelectListProps, SelectListSlots } from "./select";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectListProps>(), {
  asChild: undefined,
  items: undefined,
  renderItems: true,
});

defineSlots<SelectListSlots>();

const select = useSelectContext();
const listItems = computed(() => props.items ?? select.value.collection.items);
const itemToValue = (item: unknown) => select.value.collection.getItemValue(item) ?? String(item ?? "");
</script>

<template>
  <ArkSelect.List
    v-bind="$attrs"
    class="kappa-select__list"
    data-slot="select-list"
    :as-child="props.asChild"
  >
    <template v-if="props.renderItems">
      <template v-for="item in listItems" :key="itemToValue(item)">
        <slot :item="item" />
      </template>
    </template>
    <slot v-else />
  </ArkSelect.List>
</template>

<style src="./select.css"></style>
