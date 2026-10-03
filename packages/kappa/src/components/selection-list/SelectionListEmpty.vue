<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListEmptyProps, SelectionListEmptySlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Pick<SelectionListEmptyProps, "asChild">>(), { asChild: undefined });
defineSlots<SelectionListEmptySlots>();
</script>

<template><ArkListbox.Empty v-bind="$attrs" class="kappa-selection-list__empty" data-slot="selection-list-empty" :as-child="props.asChild"><slot>No options</slot></ArkListbox.Empty></template>
