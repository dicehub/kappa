<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListInputProps, SelectionListInputSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Pick<SelectionListInputProps, "asChild" | "autoHighlight" | "keyboardPriority">>(), { asChild: undefined, autoHighlight: undefined, keyboardPriority: undefined });
defineSlots<SelectionListInputSlots>();
</script>

<template><ArkListbox.Input v-bind="$attrs" class="kappa-selection-list__input" data-slot="selection-list-input" :as-child="props.asChild" :auto-highlight="props.autoHighlight" :keyboard-priority="props.keyboardPriority"><slot /></ArkListbox.Input></template>
