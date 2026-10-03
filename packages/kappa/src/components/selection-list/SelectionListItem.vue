<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListItemProps, SelectionListItemSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SelectionListItemProps>(), { asChild: undefined, highlightOnHover: undefined });
defineSlots<SelectionListItemSlots>();
</script>

<template><ArkListbox.Item v-bind="$attrs" class="kappa-selection-list__item" data-slot="selection-list-item" :as-child="props.asChild" :highlight-on-hover="props.highlightOnHover" :item="props.item"><slot /></ArkListbox.Item></template>
