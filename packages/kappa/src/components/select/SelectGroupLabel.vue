<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectGroupLabelProps, SelectGroupLabelSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectGroupLabelProps>(), {
  asChild: undefined,
});

defineSlots<SelectGroupLabelSlots>();
</script>

<template>
  <ArkSelect.ItemGroupLabel
    v-bind="$attrs"
    class="kappa-select__group-label"
    data-slot="select-group-label"
    :as-child="asChild"
  >
    <slot />
  </ArkSelect.ItemGroupLabel>
</template>

<style src="./select.css"></style>
