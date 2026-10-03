<script setup lang="ts">
import { Listbox as ArkListbox } from "@ark-ui/vue/listbox";
import type { SelectionListItemIndicatorProps, SelectionListItemIndicatorSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Pick<SelectionListItemIndicatorProps, "asChild">>(), { asChild: undefined });
defineSlots<SelectionListItemIndicatorSlots>();
</script>

<template>
  <ArkListbox.ItemIndicator v-bind="$attrs" class="kappa-selection-list__item-indicator" data-slot="selection-list-item-indicator" :as-child="props.asChild">
    <slot><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 8.3 3.1 3.1L13 4.8" /></svg></slot>
  </ArkListbox.ItemIndicator>
</template>
