<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ClearTrigger
    v-bind="$attrs"
    class="kappa-combobox__clear-trigger"
    data-slot="combobox-clear-trigger"
  >
    <slot>
      <span class="kappa-combobox__clear-icon" aria-hidden="true"></span>
    </slot>
  </Combobox.ClearTrigger>
</template>
