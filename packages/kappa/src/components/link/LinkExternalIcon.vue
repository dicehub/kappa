<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <svg
    v-bind="$attrs"
    class="kappa-link__external-icon"
    data-slot="link-external-icon"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M9 4H8.8C7.12 4 6.28 4 5.64 4.33A3 3 0 0 0 4.33 5.64C4 6.28 4 7.12 4 8.8v6.4c0 1.68 0 2.52.33 3.16a3 3 0 0 0 1.31 1.31c.64.33 1.48.33 3.16.33h6.4c1.68 0 2.52 0 3.16-.33a3 3 0 0 0 1.31-1.31c.33-.64.33-1.48.33-3.16V15"
    />
    <path d="M14 4h6m0 0v6m0-6-9 9" />
  </svg>
</template>

<style src="./link.css"></style>
