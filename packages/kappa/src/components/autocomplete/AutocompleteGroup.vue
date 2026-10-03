<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.ItemGroup v-bind="$attrs" class="kappa-autocomplete__group">
    <slot />
  </Combobox.ItemGroup>
</template>
