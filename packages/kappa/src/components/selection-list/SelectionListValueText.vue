<script setup lang="ts">
import { Listbox as ArkListbox, useListboxContext } from "@ark-ui/vue/listbox";
import { computed } from "vue";
import type { SelectionListValueTextProps, SelectionListValueTextSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Pick<SelectionListValueTextProps, "asChild" | "placeholder">>(), { asChild: undefined, placeholder: undefined });
defineSlots<SelectionListValueTextSlots>();
const selectionList = useListboxContext();
const displayValue = computed(
  () => selectionList.value.valueAsString || props.placeholder || "No selection",
);
</script>

<template><ArkListbox.ValueText v-bind="$attrs" class="kappa-selection-list__value-text" data-slot="selection-list-value-text" :as-child="props.asChild" :placeholder="props.placeholder"><slot>{{ displayValue }}</slot></ArkListbox.ValueText></template>
