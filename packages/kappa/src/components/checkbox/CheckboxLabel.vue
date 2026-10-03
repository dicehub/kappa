<script setup lang="ts">
import { Checkbox as ArkCheckbox } from "@ark-ui/vue/checkbox";
import type { CheckboxLabelProps, CheckboxLabelSlots } from "./checkbox";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<CheckboxLabelProps>(), {
  asChild: undefined,
});

defineSlots<CheckboxLabelSlots>();
</script>

<template>
  <ArkCheckbox.Label
    v-bind="$attrs"
    class="kappa-checkbox__label"
    data-slot="checkbox-label"
    :as-child="asChild"
  >
    <slot />
  </ArkCheckbox.Label>
</template>
