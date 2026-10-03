<script setup lang="ts">
defineProps<{ double?: boolean; forward?: boolean }>();
</script>

<template>
  <svg
    class="kappa-pagination__arrow"
    :data-forward="forward ? '' : undefined"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-if="double" d="m11 17-5-5 5-5m7 10-5-5 5-5" />
    <path v-else d="m15 18-6-6 6-6" />
  </svg>
</template>
