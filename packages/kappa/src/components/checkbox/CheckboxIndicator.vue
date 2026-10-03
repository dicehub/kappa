<script setup lang="ts">
import { Checkbox as ArkCheckbox } from "@ark-ui/vue/checkbox";
import type { CheckboxIndicatorProps, CheckboxIndicatorSlots } from "./checkbox";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<CheckboxIndicatorProps>(), {
  asChild: undefined,
  indeterminate: undefined,
});

defineSlots<CheckboxIndicatorSlots>();
</script>

<template>
  <ArkCheckbox.Indicator
    v-bind="$attrs"
    class="kappa-checkbox__indicator"
    data-slot="checkbox-indicator"
    :as-child="asChild"
    :indeterminate="indeterminate"
  >
    <slot />
  </ArkCheckbox.Indicator>
</template>
