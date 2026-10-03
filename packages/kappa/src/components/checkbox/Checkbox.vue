<script setup lang="ts">
import { Checkbox as ArkCheckbox } from "@ark-ui/vue/checkbox";
import type { CheckboxCheckedChangeDetails, CheckboxCheckedState } from "@ark-ui/vue/checkbox";
import { computed, ref, useTemplateRef } from "vue";
import { syncCheckboxIndeterminate } from "./checkbox-indeterminate";
import {
  resolveCheckboxCheckedState,
  type CheckboxEmits,
  type CheckboxProps,
  type CheckboxSlots,
} from "./checkbox";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxProps>(), {
  asChild: undefined,
  checked: undefined,
  defaultChecked: undefined,
  disabled: undefined,
  form: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  name: undefined,
  readOnly: undefined,
  required: undefined,
  value: undefined,
});

const emit = defineEmits<CheckboxEmits>();
defineSlots<CheckboxSlots>();

const normalizedChecked = computed(() => resolveCheckboxCheckedState(props.checked));
const normalizedDefaultChecked = computed(() => resolveCheckboxCheckedState(props.defaultChecked));

const rootElement = useTemplateRef("root");
const uncontrolledChecked = ref<CheckboxCheckedState | undefined>(normalizedDefaultChecked.value);

const handleCheckedChange = (details: CheckboxCheckedChangeDetails) => {
  uncontrolledChecked.value = details.checked;
  emit("checkedChange", details);
};

syncCheckboxIndeterminate(
  rootElement,
  () => (normalizedChecked.value ?? uncontrolledChecked.value) === "indeterminate",
);
</script>

<template>
  <ArkCheckbox.Root
    ref="root"
    v-bind="$attrs"
    class="kappa-checkbox"
    data-slot="checkbox"
    :as-child="props.asChild"
    :checked="normalizedChecked"
    :default-checked="normalizedDefaultChecked"
    :disabled="props.disabled"
    :form="props.form"
    :id="props.id"
    :ids="props.ids"
    :invalid="props.invalid"
    :name="props.name"
    :read-only="props.readOnly"
    :required="props.required"
    :value="props.value"
    @checked-change="handleCheckedChange"
    @update:checked="emit('update:checked', $event)"
  >
    <slot />
    <ArkCheckbox.HiddenInput />
  </ArkCheckbox.Root>
</template>

<style src="./checkbox.css"></style>
