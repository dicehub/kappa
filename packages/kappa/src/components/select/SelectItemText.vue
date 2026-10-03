<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectItemTextProps, SelectItemTextSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectItemTextProps>(), {
  asChild: undefined,
});

defineSlots<SelectItemTextSlots>();
</script>

<template>
  <ArkSelect.ItemText
    v-bind="$attrs"
    class="kappa-select__item-text"
    data-slot="select-item-text"
    :as-child="asChild"
  >
    <slot />
  </ArkSelect.ItemText>
</template>

<style src="./select.css"></style>
