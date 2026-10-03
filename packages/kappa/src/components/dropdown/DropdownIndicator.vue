<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownIndicatorProps, DropdownIndicatorSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownIndicatorProps>(), {
  asChild: undefined,
});

defineSlots<DropdownIndicatorSlots>();
</script>

<template>
  <ArkMenu.Indicator
    v-bind="$attrs"
    class="kappa-dropdown__indicator"
    data-slot="dropdown-indicator"
    :as-child="props.asChild"
  >
    <slot>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </slot>
  </ArkMenu.Indicator>
</template>
