<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownItemIndicatorProps, DropdownItemIndicatorSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownItemIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<DropdownItemIndicatorSlots>();
</script>

<template>
  <ArkMenu.ItemIndicator
    v-bind="$attrs"
    class="kappa-dropdown__item-indicator"
    data-slot="dropdown-item-indicator"
    :as-child="props.asChild"
  >
    <slot>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="m3 8.25 3 3 7-7" />
      </svg>
    </slot>
  </ArkMenu.ItemIndicator>
</template>

<style src="./dropdown.css"></style>
