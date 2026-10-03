<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import { computed, ref } from "vue";
import type {
  DropdownRadioGroupEmits,
  DropdownRadioGroupProps,
  DropdownRadioGroupSlots,
} from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownRadioGroupProps>(), {
  asChild: undefined,
  defaultValue: undefined,
  id: undefined,
  modelValue: undefined,
});

const emit = defineEmits<DropdownRadioGroupEmits>();
defineSlots<DropdownRadioGroupSlots>();

const internalValue = ref(props.defaultValue);
const resolvedValue = computed(() => props.modelValue ?? internalValue.value);

const handleValueUpdate = (value: string) => {
  if (props.modelValue === undefined) internalValue.value = value;
  emit("update:modelValue", value);
  emit("valueChange", value);
};
</script>

<template>
  <ArkMenu.RadioItemGroup
    v-bind="$attrs"
    class="kappa-dropdown__radio-group"
    data-slot="dropdown-radio-group"
    :as-child="props.asChild"
    :id="props.id"
    :model-value="resolvedValue"
    @update:model-value="handleValueUpdate"
  >
    <slot />
  </ArkMenu.RadioItemGroup>
</template>

<style src="./dropdown.css"></style>
