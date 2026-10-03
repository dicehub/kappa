<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import type { FieldLabelSlots } from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ asChild?: boolean }>(), {
  asChild: undefined,
});

defineSlots<FieldLabelSlots>();
</script>

<template>
  <ArkField.Label
    v-bind="$attrs"
    class="kappa-field__label"
    data-slot="field-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkField.Label>
</template>
