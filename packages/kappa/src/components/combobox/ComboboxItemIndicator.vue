<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemIndicator
    v-bind="$attrs"
    class="kappa-combobox__item-indicator"
    data-slot="combobox-item-indicator"
  >
    <slot>
      <svg
        class="kappa-combobox__check-icon"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <path d="m3 8.2 3.1 3.1L13 4.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
      </svg>
    </slot>
  </Combobox.ItemIndicator>
</template>
