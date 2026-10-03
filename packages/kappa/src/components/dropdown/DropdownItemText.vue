<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownItemTextProps, DropdownItemTextSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownItemTextProps>(), {
  asChild: undefined,
});

defineSlots<DropdownItemTextSlots>();
</script>

<template>
  <ArkMenu.ItemText
    v-bind="$attrs"
    class="kappa-dropdown__item-text"
    data-slot="dropdown-item-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkMenu.ItemText>
</template>

<style src="./dropdown.css"></style>
