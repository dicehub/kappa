<script setup lang="ts">
import type { SelectSeparatorProps, SelectSeparatorSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectSeparatorProps>(), {
  orientation: "horizontal",
});

defineSlots<SelectSeparatorSlots>();
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-select__separator"
    data-slot="select-separator"
    role="separator"
    :aria-orientation="orientation"
  >
    <slot />
  </div>
</template>

<style src="./select.css"></style>
