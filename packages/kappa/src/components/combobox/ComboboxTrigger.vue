<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });
</script>

<template>
  <Combobox.Trigger v-bind="$attrs" class="kappa-combobox__trigger" data-slot="combobox-trigger">
    <slot />
  </Combobox.Trigger>
</template>
