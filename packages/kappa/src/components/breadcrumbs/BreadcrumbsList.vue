<script setup lang="ts">
import type { BreadcrumbsListSlots } from "./breadcrumbs";

defineOptions({ inheritAttrs: false });
defineSlots<BreadcrumbsListSlots>();
</script>

<template>
  <ol v-bind="$attrs" class="kappa-breadcrumbs__list" data-slot="breadcrumbs-list" role="list">
    <slot />
  </ol>
</template>
