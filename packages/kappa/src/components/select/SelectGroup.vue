<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectGroupProps, SelectGroupSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectGroupProps>(), {
  asChild: undefined,
  id: undefined,
});

defineSlots<SelectGroupSlots>();
</script>

<template>
  <ArkSelect.ItemGroup
    v-bind="$attrs"
    class="kappa-select__group"
    data-slot="select-group"
    :as-child="asChild"
    :id="id"
  >
    <slot />
  </ArkSelect.ItemGroup>
</template>

<style src="./select.css"></style>
