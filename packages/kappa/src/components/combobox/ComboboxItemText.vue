<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemText
    v-bind="$attrs"
    class="kappa-combobox__item-text"
    data-slot="combobox-item-text"
  >
    <slot />
  </Combobox.ItemText>
</template>
