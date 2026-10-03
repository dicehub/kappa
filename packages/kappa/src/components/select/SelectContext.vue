<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectContextSlots } from "./select";

defineOptions({ inheritAttrs: false });

defineSlots<SelectContextSlots>();
</script>

<template>
  <ArkSelect.Context v-slot="context">
    <slot v-bind="context" />
  </ArkSelect.Context>
</template>

<style src="./select.css"></style>
