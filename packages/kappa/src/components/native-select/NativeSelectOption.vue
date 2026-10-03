<script setup lang="ts">
import type { NativeSelectOptionSlots } from "./native-select";

defineOptions({ inheritAttrs: false });
defineSlots<NativeSelectOptionSlots>();
</script>

<template>
  <option
    v-bind="$attrs"
    class="kappa-native-select__option"
    data-slot="native-select-option"
  >
    <slot />
  </option>
</template>

<style src="./native-select.css"></style>
