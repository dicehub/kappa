<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-combobox__separator"
    data-slot="combobox-separator"
    role="separator"
  ></div>
</template>
