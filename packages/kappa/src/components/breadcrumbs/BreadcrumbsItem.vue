<script setup lang="ts">
import type { BreadcrumbsItemSlots } from "./breadcrumbs";

defineOptions({ inheritAttrs: false });
defineSlots<BreadcrumbsItemSlots>();
</script>

<template>
  <li v-bind="$attrs" class="kappa-breadcrumbs__item" data-slot="breadcrumbs-item">
    <slot />
  </li>
</template>
