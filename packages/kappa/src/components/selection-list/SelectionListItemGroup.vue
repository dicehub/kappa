<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListItemGroupProps, SelectionListItemGroupSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SelectionListItemGroupProps>(), { asChild: undefined });
defineSlots<SelectionListItemGroupSlots>();
</script>

<template><ArkListbox.ItemGroup v-bind="$attrs" class="kappa-selection-list__item-group" data-slot="selection-list-item-group" :as-child="props.asChild" :id="props.id"><slot /></ArkListbox.ItemGroup></template>
