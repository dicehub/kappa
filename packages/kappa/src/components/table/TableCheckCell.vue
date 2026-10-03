<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { Checkbox, type CheckboxCheckedChangeDetails, type CheckboxCheckedState } from "../checkbox";
import TableCell from "./TableCell.vue";
import type {
  TableCheckCellProps,
  TableCheckCellSlots,
  TableCheckboxEmits,
} from "./table";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TableCheckCellProps>(), {
  checked: undefined,
  disabled: false,
  indeterminate: false,
  label: undefined,
  sticky: undefined,
});

const emit = defineEmits<TableCheckboxEmits>();
defineSlots<TableCheckCellSlots>();

const attrs = useAttrs();
const cellAttrs = computed(() => {
  const { "aria-label": _ariaLabel, ...rest } = attrs;
  return rest;
});
const inputLabel = computed(() => {
  if (props.label) return props.label;
  if (typeof attrs["aria-label"] === "string") return attrs["aria-label"];
  return "Select row";
});
const checkboxChecked = computed<CheckboxCheckedState | undefined>(() =>
  props.indeterminate ? "indeterminate" : props.checked,
);

const handleCheckedChange = (details: CheckboxCheckedChangeDetails) => {
  const checked = details.checked === "indeterminate" ? true : Boolean(details.checked);
  emit("update:checked", checked);
  emit("checkedChange", { checked, eventDetails: details });
  emit("valueChange", checked);
};
</script>

<template>
  <TableCell
    v-bind="cellAttrs"
    :sticky="props.sticky"
    class="kappa-table__check-cell"
  >
    <Checkbox
      class="kappa-table__checkbox"
      :aria-label="inputLabel"
      :checked="checkboxChecked"
      :disabled="props.disabled"
      @checked-change="handleCheckedChange"
    >
      <Checkbox.Control />
    </Checkbox>
    <slot />
  </TableCell>
</template>
