<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import type {
  FieldControlEmits,
  FieldTextareaControlProps,
  FieldTextareaSlots,
} from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldTextareaControlProps>(), {
  asChild: undefined,
  autoresize: undefined,
  modelValue: undefined,
});

const emit = defineEmits<FieldControlEmits>();
defineSlots<FieldTextareaSlots>();
</script>

<template>
  <ArkField.Textarea
    v-bind="$attrs"
    class="kappa-field__textarea"
    data-slot="field-textarea"
    :as-child="props.asChild"
    :autoresize="props.autoresize"
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </ArkField.Textarea>
</template>
