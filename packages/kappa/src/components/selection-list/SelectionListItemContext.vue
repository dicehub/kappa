<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListItemContextSlots } from "./selection-list";
defineSlots<SelectionListItemContextSlots>();
</script>

<template><ArkListbox.ItemContext v-slot="context"><slot v-bind="context" /></ArkListbox.ItemContext></template>
