<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemText v-bind="$attrs" class="kappa-autocomplete__item-text">
    <slot />
  </Combobox.ItemText>
</template>
