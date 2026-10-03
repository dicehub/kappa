<script setup lang="ts">
import type { BreadcrumbsPageSlots } from "./breadcrumbs";

defineOptions({ inheritAttrs: false });
defineSlots<BreadcrumbsPageSlots>();
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-breadcrumbs__page"
    data-slot="breadcrumbs-page"
    aria-current="page"
  >
    <slot />
  </span>
</template>
