<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownLabelProps, DropdownLabelSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownLabelProps>(), {
  asChild: undefined,
  inset: false,
});

defineSlots<DropdownLabelSlots>();
</script>

<template>
  <ArkMenu.ItemGroupLabel
    v-bind="$attrs"
    class="kappa-dropdown__label"
    data-slot="dropdown-label"
    :as-child="props.asChild"
    :data-inset="props.inset ? '' : undefined"
  >
    <slot />
  </ArkMenu.ItemGroupLabel>
</template>

<style src="./dropdown.css"></style>
