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
    <slot>
      <svg
        class="kappa-breadcrumbs__separator-icon"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m6.25 3.75 4 4.25-4 4.25" />
      </svg>
    </slot>
  </li>
</template>
