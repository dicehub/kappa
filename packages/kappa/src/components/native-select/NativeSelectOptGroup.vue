<script setup lang="ts">
import type { NativeSelectOptGroupSlots } from "./native-select";

defineOptions({ inheritAttrs: false });
defineSlots<NativeSelectOptGroupSlots>();
</script>

<template>
  <optgroup
    v-bind="$attrs"
    class="kappa-native-select__optgroup"
    data-slot="native-select-optgroup"
  >
    <slot />
  </optgroup>
</template>

<style src="./native-select.css"></style>
