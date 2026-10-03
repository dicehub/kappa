<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownArrowProps, DropdownArrowSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownArrowProps>(), {
  asChild: undefined,
});

defineSlots<DropdownArrowSlots>();
</script>

<template>
  <ArkMenu.Arrow
    v-bind="$attrs"
    class="kappa-dropdown__arrow"
    data-slot="dropdown-arrow"
    :as-child="props.asChild"
  >
    <slot><ArkMenu.ArrowTip class="kappa-dropdown__arrow-tip" /></slot>
  </ArkMenu.Arrow>
</template>

<style src="./dropdown.css"></style>
