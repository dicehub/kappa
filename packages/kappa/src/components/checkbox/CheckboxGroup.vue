<script setup lang="ts">
import { Checkbox as ArkCheckbox } from "@ark-ui/vue/checkbox";
import type { CheckboxGroupEmits, CheckboxGroupProps, CheckboxGroupSlots } from "./checkbox";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  asChild: undefined,
  defaultValue: undefined,
  disabled: undefined,
  invalid: undefined,
  maxSelectedValues: undefined,
  modelValue: undefined,
  name: undefined,
  readOnly: undefined,
});

const emit = defineEmits<CheckboxGroupEmits>();
defineSlots<CheckboxGroupSlots>();
</script>

<template>
  <ArkCheckbox.Group
    v-bind="$attrs"
    class="kappa-checkbox-group"
    data-slot="checkbox-group"
    :as-child="props.asChild"
    :default-value="props.defaultValue"
    :disabled="props.disabled"
    :invalid="props.invalid"
    :max-selected-values="props.maxSelectedValues"
    :model-value="props.modelValue"
    :name="props.name"
    :read-only="props.readOnly"
    @update:model-value="emit('update:modelValue', $event)"
    @value-change="emit('valueChange', $event)"
  >
    <slot />
  </ArkCheckbox.Group>
</template>

<style src="./checkbox.css"></style>
