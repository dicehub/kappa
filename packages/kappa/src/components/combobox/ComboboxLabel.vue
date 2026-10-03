<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Label v-bind="$attrs" class="kappa-combobox__label" data-slot="combobox-label">
    <slot />
  </Combobox.Label>
</template>
