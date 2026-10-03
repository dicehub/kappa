<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import type { FieldControlEmits, FieldControlPartProps, FieldSelectSlots } from "./field";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FieldControlPartProps>(), {
  asChild: undefined,
  modelValue: undefined,
});

const emit = defineEmits<FieldControlEmits>();
defineSlots<FieldSelectSlots>();
</script>

<template>
  <span class="kappa-field__select-control" data-slot="field-select-control">
    <ArkField.Select
      v-bind="$attrs"
      class="kappa-field__select"
      data-slot="field-select"
      :as-child="props.asChild"
      :model-value="props.modelValue == null ? undefined : String(props.modelValue)"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <slot />
    </ArkField.Select>
    <svg
      class="kappa-field__select-icon"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>
