<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Content v-bind="$attrs" class="kappa-command-palette__list">
    <slot />
  </Combobox.Content>
</template>

<style src="./command-palette.css"></style>
