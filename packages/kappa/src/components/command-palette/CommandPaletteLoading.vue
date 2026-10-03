<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div v-bind="$attrs" class="kappa-command-palette__loading" role="status">
    <slot>
      <span class="kappa-command-palette__spinner" aria-hidden="true" />
      <span>Loading results...</span>
    </slot>
  </div>
</template>

<style src="./command-palette.css"></style>
