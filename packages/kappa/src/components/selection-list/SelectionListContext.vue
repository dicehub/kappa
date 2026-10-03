<script setup lang="ts">
import { Listbox as ArkListbox, type CollectionItem } from "@ark-ui/vue/listbox";
import type { SelectionListContextSlots } from "./selection-list";
defineSlots<SelectionListContextSlots<CollectionItem>>();
</script>

<template><ArkListbox.Context v-slot="context"><slot v-bind="context" /></ArkListbox.Context></template>
