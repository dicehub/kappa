<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemGroupLabel
    v-bind="$attrs"
    class="kappa-combobox__group-label"
    data-slot="combobox-group-label"
  >
    <slot />
  </Combobox.ItemGroupLabel>
</template>
