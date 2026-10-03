<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Label v-bind="$attrs" class="kappa-autocomplete__label">
    <slot />
  </Combobox.Label>
</template>
