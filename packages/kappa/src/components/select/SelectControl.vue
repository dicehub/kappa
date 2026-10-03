<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectControlProps, SelectControlSlots } from "./select";
import { useKappaSelectContext } from "./select-context";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectControlProps>(), {
  asChild: undefined,
});

defineSlots<SelectControlSlots>();

const context = useKappaSelectContext();
</script>

<template>
  <ArkSelect.Control
    v-bind="$attrs"
    class="kappa-select__control"
    data-slot="select-control"
    :as-child="asChild"
    :data-invalid="context?.invalid.value ? '' : undefined"
  >
    <slot />
  </ArkSelect.Control>
</template>

<style src="./select.css"></style>
