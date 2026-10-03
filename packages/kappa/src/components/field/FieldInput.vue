<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import type { FieldControlEmits, FieldControlPartProps, FieldInputSlots } from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldControlPartProps>(), {
  asChild: undefined,
  modelValue: undefined,
});

const emit = defineEmits<FieldControlEmits>();
defineSlots<FieldInputSlots>();
</script>

<template>
  <ArkField.Input
    v-bind="$attrs"
    class="kappa-field__input"
    data-slot="field-input"
    :as-child="props.asChild"
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </ArkField.Input>
</template>
