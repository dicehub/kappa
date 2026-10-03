<script setup lang="ts">
import { Combobox, useComboboxContext } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import type { ComboboxListProps } from "./combobox";
import { useKappaComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

defineSlots<{
  default(props: { item?: unknown }): unknown;
}>();

const props = withDefaults(defineProps<ComboboxListProps>(), {
  renderItems: true,
});
const combobox = useComboboxContext();
const context = useKappaComboboxContext();
const activeCollection = computed(() => context.collection.value ?? combobox.value.collection);
const listItems = computed(() => props.items ?? activeCollection.value.items ?? []);
const renderableItems = computed(() => listItems.value.filter((item) => item != null));
const itemToValue = (item: unknown) =>
  activeCollection.value.getItemValue(item) ?? String(item ?? "");
</script>

<template>
  <Combobox.List v-bind="$attrs" class="kappa-combobox__list" data-slot="combobox-list">
    <template v-if="renderItems">
      <template v-for="item in renderableItems" :key="itemToValue(item)">
        <slot :item="item" />
      </template>
    </template>
    <slot v-else />
  </Combobox.List>
</template>
