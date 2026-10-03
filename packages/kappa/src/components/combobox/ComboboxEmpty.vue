<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Empty v-bind="$attrs" class="kappa-combobox__empty" data-slot="combobox-empty">
    <slot>No results found.</slot>
  </Combobox.Empty>
</template>
