<script setup lang="ts">
import { Field as ArkField, useFieldContext } from "@ark-ui/vue/field";
import type { FieldRequiredIndicatorSlots } from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
  asChild: undefined,
});

const field = useFieldContext();

defineSlots<FieldRequiredIndicatorSlots>();
</script>

<template>
  <ArkField.RequiredIndicator
    v-if="field.required"
    v-bind="$attrs"
    class="kappa-field__required-indicator"
    data-slot="field-required-indicator"
    :as-child="props.asChild"
  >
    <slot>*</slot>
  </ArkField.RequiredIndicator>
  <span
    v-else-if="$slots.fallback"
    v-bind="$attrs"
    class="kappa-field__required-indicator"
    data-optional=""
    data-slot="field-required-indicator"
  >
    <slot name="fallback" />
  </span>
</template>
