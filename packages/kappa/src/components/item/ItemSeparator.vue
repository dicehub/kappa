<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <hr
    v-bind="$attrs"
    class="kappa-item__separator"
    data-slot="item-separator"
  />
</template>
