<script setup lang="ts">
import type { SelectionListItemLayoutSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
defineSlots<SelectionListItemLayoutSlots>();
</script>

<template><span v-bind="$attrs" class="kappa-selection-list__item-media" data-slot="selection-list-item-media"><slot /></span></template>
