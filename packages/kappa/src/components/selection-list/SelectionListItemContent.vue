<script setup lang="ts">
import type { SelectionListItemLayoutSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
defineSlots<SelectionListItemLayoutSlots>();
</script>

<template><div v-bind="$attrs" class="kappa-selection-list__item-content" data-slot="selection-list-item-content"><slot /></div></template>
