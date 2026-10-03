<script setup lang="ts">
defineProps<{ kind: "file" | "folder" }>();
</script>
<template>
  <svg class="kappa-file-browser__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path v-if="kind === 'folder'" d="M2.5 5.5h6l1.5 2h7.5v9h-15zM2.5 7.5v-4h6l1.5 2h6v2" />
    <path v-else d="M5 2.5h6l4 4v11H5zM11 2.5v4h4M7.5 10h5M7.5 13h5" />
  </svg>
</template>
