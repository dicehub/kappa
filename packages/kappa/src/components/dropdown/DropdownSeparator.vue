<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownSeparatorProps, DropdownSeparatorSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownSeparatorProps>(), {
  asChild: undefined,
});

defineSlots<DropdownSeparatorSlots>();
</script>

<template>
  <ArkMenu.Separator
    v-bind="$attrs"
    class="kappa-dropdown__separator"
    data-slot="dropdown-separator"
    :as-child="props.asChild"
  >
    <slot v-if="props.asChild" />
  </ArkMenu.Separator>
</template>

<style src="./dropdown.css"></style>
