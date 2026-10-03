<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import { computed, ref } from "vue";
import type {
  DropdownCheckboxItemEmits,
  DropdownCheckboxItemProps,
  DropdownCheckboxItemSlots,
} from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownCheckboxItemProps>(), {
  asChild: undefined,
  checked: undefined,
  closeOnSelect: false,
  defaultChecked: false,
  disabled: undefined,
  inset: false,
  valueText: undefined,
});

const emit = defineEmits<DropdownCheckboxItemEmits>();
defineSlots<DropdownCheckboxItemSlots>();

const internalChecked = ref(props.defaultChecked);
const resolvedChecked = computed(() => props.checked ?? internalChecked.value);

const handleCheckedUpdate = (value: boolean) => {
  if (props.checked === undefined) internalChecked.value = value;
  emit("update:checked", value);
  emit("checkedChange", value);
};
</script>

<template>
  <ArkMenu.CheckboxItem
    v-bind="$attrs"
    class="kappa-dropdown__item kappa-dropdown__option-item"
    data-slot="dropdown-checkbox-item"
    :as-child="props.asChild"
    :checked="resolvedChecked"
    :close-on-select="props.closeOnSelect"
    :data-inset="props.inset ? '' : undefined"
    :disabled="props.disabled"
    :value="props.value"
    :value-text="props.valueText"
    @update:checked="handleCheckedUpdate"
  >
    <slot v-if="props.asChild" />
    <template v-else>
      <ArkMenu.ItemIndicator
        class="kappa-dropdown__item-indicator"
        data-slot="dropdown-item-indicator"
      >
        <slot name="indicator">
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="m3 8.25 3 3 7-7" />
          </svg>
        </slot>
      </ArkMenu.ItemIndicator>
      <slot />
      <slot name="end" />
    </template>
  </ArkMenu.CheckboxItem>
</template>

<style src="./dropdown.css"></style>
