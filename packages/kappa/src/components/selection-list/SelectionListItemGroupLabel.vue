<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListItemGroupLabelProps, SelectionListItemGroupLabelSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SelectionListItemGroupLabelProps>(), { asChild: undefined });
defineSlots<SelectionListItemGroupLabelSlots>();
</script>

<template><ArkListbox.ItemGroupLabel v-bind="$attrs" class="kappa-selection-list__item-group-label" data-slot="selection-list-item-group-label" :as-child="props.asChild"><slot /></ArkListbox.ItemGroupLabel></template>
