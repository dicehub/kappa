<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import type { FieldErrorTextSlots } from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
  asChild: undefined,
});

defineSlots<FieldErrorTextSlots>();
</script>

<template>
  <ArkField.ErrorText
    v-bind="$attrs"
    class="kappa-field__error-text"
    data-slot="field-error-text"
    :as-child="props.asChild"
  >
    <slot />
  </ArkField.ErrorText>
</template>
