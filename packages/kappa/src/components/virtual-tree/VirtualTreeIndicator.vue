<script setup lang="ts">
import Loader from "../loader/Loader.vue";

defineProps<{ hasChildren: boolean; loading: boolean }>();
</script>

<template>
  <Loader v-if="loading" :size="14" decorative />
  <svg v-else-if="hasChildren" viewBox="0 0 16 16" focusable="false">
    <path d="m6 3 5 5-5 5" />
  </svg>
</template>
