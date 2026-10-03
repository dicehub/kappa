<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListItemTextProps, SelectionListItemTextSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Pick<SelectionListItemTextProps, "asChild">>(), { asChild: undefined });
defineSlots<SelectionListItemTextSlots>();
</script>

<template><ArkListbox.ItemText v-bind="$attrs" class="kappa-selection-list__item-text" data-slot="selection-list-item-text" :as-child="props.asChild"><slot /></ArkListbox.ItemText></template>
