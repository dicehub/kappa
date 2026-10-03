<script setup lang="ts">
defineProps<{ name: "add" | "more" | "refresh" }>();
</script>
<template>
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <g v-if="name === 'more'" fill="currentColor"><circle cx="3" cy="8" r="1" /><circle cx="8" cy="8" r="1" /><circle cx="13" cy="8" r="1" /></g>
    <path v-else :d="name === 'add' ? 'M8 3v10M3 8h10' : 'M13 6a5.2 5.2 0 1 0 .1 4M13 2v4H9'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
