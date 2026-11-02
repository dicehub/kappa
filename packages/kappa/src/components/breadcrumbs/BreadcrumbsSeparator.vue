<script setup lang="ts">
import type { BreadcrumbsSeparatorSlots } from "./breadcrumbs";

defineOptions({ inheritAttrs: false });
defineSlots<BreadcrumbsSeparatorSlots>();
</script>

<template>
  <li
    v-bind="$attrs"
    class="kappa-breadcrumbs__separator"
    data-slot="breadcrumbs-separator"
    role="presentation"
    aria-hidden="true"
  >
    <slot>/</slot>
  </li>
</template>
