<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectItemContextSlots } from "./select";

defineOptions({ inheritAttrs: false });

defineSlots<SelectItemContextSlots>();
</script>

<template>
  <ArkSelect.ItemContext v-slot="context">
    <slot v-bind="context" />
  </ArkSelect.ItemContext>
</template>

<style src="./select.css"></style>
