<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListLabelProps, SelectionListLabelSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SelectionListLabelProps>(), { asChild: undefined });
defineSlots<SelectionListLabelSlots>();
</script>

<template><ArkListbox.Label v-bind="$attrs" class="kappa-selection-list__label" data-slot="selection-list-label" :as-child="props.asChild"><slot /></ArkListbox.Label></template>
