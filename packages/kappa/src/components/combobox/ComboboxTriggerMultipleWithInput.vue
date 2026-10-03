<script setup lang="ts">
import { Combobox, useComboboxContext } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import type { ComboboxTriggerMultipleWithInputProps } from "./combobox";
import { useKappaComboboxContext } from "./combobox-context";
import ComboboxChip from "./ComboboxChip.vue";
import ComboboxClearTrigger from "./ComboboxClearTrigger.vue";
import ComboboxInput from "./ComboboxInput.vue";

defineOptions({ inheritAttrs: false });

defineSlots<{
  "chip-list"?: (props: { items: unknown[] }) => unknown;
  clear?: () => unknown;
  trigger?: () => unknown;
}>();

const props = withDefaults(defineProps<ComboboxTriggerMultipleWithInputProps>(), {
  clearable: true,
  inputSide: "right",
  showTrigger: true,
});
const combobox = useComboboxContext();
const context = useKappaComboboxContext();
const resolvedSize = computed(() => props.size ?? context.size.value);
const selectedItems = computed(() =>
  combobox.value.selectedItems ?? context.collection.value.findMany(combobox.value.value),
);
const hasValue = computed(
  () => Boolean(combobox.value.inputValue) || combobox.value.value.length > 0,
);
const itemToKey = (item: unknown) =>
  context.collection.value.getItemValue(item) ?? String(item ?? "");
</script>

<template>
  <Combobox.Control
    v-bind="$attrs"
    class="kappa-combobox__multi-control"
    :class="[
      `kappa-combobox__multi-control--${resolvedSize}`,
      `kappa-combobox__multi-control--input-${inputSide}`,
    ]"
    :data-invalid="context.invalid.value ? '' : undefined"
    data-slot="combobox-trigger-multiple-with-input"
  >
    <div class="kappa-combobox__chip-list">
      <slot name="chip-list" :items="selectedItems">
        <ComboboxChip v-for="item in selectedItems" :key="itemToKey(item)" :item="item" />
      </slot>
      <ComboboxInput
        v-bind="inputAttrs"
        class="kappa-combobox__multi-input"
        :placeholder="placeholder"
      />
    </div>
    <ComboboxClearTrigger
      v-if="clearable && hasValue"
      aria-label="Clear selection"
      class="kappa-combobox__icon-button"
    >
      <slot name="clear">
        <span class="kappa-combobox__clear-icon" aria-hidden="true"></span>
      </slot>
    </ComboboxClearTrigger>
    <Combobox.Trigger
      v-if="showTrigger"
      aria-label="Toggle options"
      class="kappa-combobox__icon-button"
    >
      <slot name="trigger">
        <span class="kappa-combobox__caret-icon" aria-hidden="true"></span>
      </slot>
    </Combobox.Trigger>
  </Combobox.Control>
</template>
