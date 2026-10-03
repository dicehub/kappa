<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemIndicator v-bind="$attrs" class="kappa-autocomplete__item-indicator">
    <slot>
      <span class="kappa-autocomplete__check" aria-hidden="true"></span>
    </slot>
  </Combobox.ItemIndicator>
</template>
