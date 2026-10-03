<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemGroupLabel v-bind="$attrs" class="kappa-command-palette__group-label">
    <slot />
  </Combobox.ItemGroupLabel>
</template>

<style src="./command-palette.css"></style>
