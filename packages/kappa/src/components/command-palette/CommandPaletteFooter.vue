<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div v-bind="$attrs" class="kappa-command-palette__footer">
    <slot />
  </div>
</template>

<style src="./command-palette.css"></style>
