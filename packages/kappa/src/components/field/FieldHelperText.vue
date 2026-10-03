<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import type { FieldHelperTextSlots } from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
  asChild: undefined,
});

defineSlots<FieldHelperTextSlots>();
</script>

<template>
  <ArkField.HelperText
    v-bind="$attrs"
    class="kappa-field__helper-text"
    data-slot="field-helper-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkField.HelperText>
</template>
