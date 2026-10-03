<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Empty v-bind="$attrs" class="kappa-autocomplete__empty">
    <slot>No results found.</slot>
  </Combobox.Empty>
</template>
