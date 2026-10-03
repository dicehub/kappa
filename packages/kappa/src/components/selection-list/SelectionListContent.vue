<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListContentProps, SelectionListContentSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Pick<SelectionListContentProps, "asChild">>(), { asChild: undefined });
defineSlots<SelectionListContentSlots>();
</script>

<template><ArkListbox.Content v-bind="$attrs" class="kappa-selection-list__content" data-slot="selection-list-content" :as-child="props.asChild"><slot /></ArkListbox.Content></template>
