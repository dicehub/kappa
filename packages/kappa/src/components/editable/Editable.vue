<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import { computed } from "vue";
import {
  EDITABLE_DEFAULT_SIZE,
  resolveEditableSize,
  type EditableEmits,
  type EditableProps,
  type EditableSlots,
} from "./editable";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EditableProps>(), {
  activationMode: undefined,
  asChild: undefined,
  autoResize: undefined,
  defaultEdit: undefined,
  defaultValue: undefined,
  disabled: undefined,
  edit: undefined,
  finalFocusEl: undefined,
  form: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  maxLength: undefined,
  modelValue: undefined,
  name: undefined,
  placeholder: undefined,
  readOnly: undefined,
  required: undefined,
  selectOnFocus: undefined,
  size: EDITABLE_DEFAULT_SIZE,
  submitMode: undefined,
  translations: undefined,
});

const emit = defineEmits<EditableEmits>();
defineSlots<EditableSlots>();

const resolvedSize = computed(() => resolveEditableSize(props.size));
</script>

<template>
  <ArkEditable.Root
    v-bind="$attrs"
    class="kappa-editable"
    data-slot="editable"
    :data-size="resolvedSize"
    :activation-mode="props.activationMode"
    :as-child="props.asChild"
    :auto-resize="props.autoResize"
    :default-edit="props.defaultEdit"
    :default-value="props.defaultValue"
    :disabled="props.disabled"
    :edit="props.edit"
    :final-focus-el="props.finalFocusEl"
    :form="props.form"
    :id="props.id"
    :ids="props.ids"
    :invalid="props.invalid"
    :max-length="props.maxLength"
    :model-value="props.modelValue"
    :name="props.name"
    :placeholder="props.placeholder"
    :read-only="props.readOnly"
    :required="props.required"
    :select-on-focus="props.selectOnFocus"
    :submit-mode="props.submitMode"
    :translations="props.translations"
    @edit-change="emit('editChange', $event)"
    @focus-outside="emit('focusOutside', $event)"
    @interact-outside="emit('interactOutside', $event)"
    @pointer-down-outside="emit('pointerDownOutside', $event)"
    @update:edit="emit('update:edit', $event)"
    @update:model-value="emit('update:modelValue', $event)"
    @value-change="emit('valueChange', $event)"
    @value-commit="emit('valueCommit', $event)"
    @value-revert="emit('valueRevert', $event)"
  >
    <slot />
  </ArkEditable.Root>
</template>

<style src="./editable.css"></style>
