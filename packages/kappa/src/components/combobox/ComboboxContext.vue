<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
</script>

<template>
  <Combobox.Context v-slot="context">
    <slot v-bind="context" />
  </Combobox.Context>
</template>
