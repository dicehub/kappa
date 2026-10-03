<script setup lang="ts">
import type { BreadcrumbsEllipsisSlots } from "./breadcrumbs";

defineOptions({ inheritAttrs: false });
defineSlots<BreadcrumbsEllipsisSlots>();
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-breadcrumbs__ellipsis"
    data-slot="breadcrumbs-ellipsis"
    role="presentation"
    aria-hidden="true"
  >
    <slot>
      <svg
        class="kappa-breadcrumbs__ellipsis-icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="3.25" cy="8" r="1" />
        <circle cx="8" cy="8" r="1" />
        <circle cx="12.75" cy="8" r="1" />
      </svg>
    </slot>
  </span>
</template>
