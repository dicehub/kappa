<script setup lang="ts">
import type { SelectionListItemLayoutSlots } from "./selection-list";
defineOptions({ inheritAttrs: false });
defineSlots<SelectionListItemLayoutSlots>();
</script>

<template><span v-bind="$attrs" class="kappa-selection-list__item-description" data-slot="selection-list-item-description"><slot /></span></template>
