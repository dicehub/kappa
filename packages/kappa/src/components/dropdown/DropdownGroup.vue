<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownGroupProps, DropdownGroupSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownGroupProps>(), {
  asChild: undefined,
  id: undefined,
});

defineSlots<DropdownGroupSlots>();
</script>

<template>
  <ArkMenu.ItemGroup
    v-bind="$attrs"
    class="kappa-dropdown__group"
    data-slot="dropdown-group"
    :as-child="props.asChild"
    :id="props.id"
  >
    <slot />
  </ArkMenu.ItemGroup>
</template>

<style src="./dropdown.css"></style>
