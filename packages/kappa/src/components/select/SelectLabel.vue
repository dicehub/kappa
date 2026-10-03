<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectLabelProps, SelectLabelSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectLabelProps>(), {
  asChild: undefined,
});

defineSlots<SelectLabelSlots>();
</script>

<template>
  <ArkSelect.Label v-bind="$attrs" class="kappa-select__label" data-slot="select-label" :as-child="asChild">
    <slot />
  </ArkSelect.Label>
</template>

<style src="./select.css"></style>
