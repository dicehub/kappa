<script setup lang="ts">
import { Combobox, useComboboxContext } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import type { ComboboxTriggerValueProps } from "./combobox";
import { useKappaComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

defineSlots<{
  default?: (props: { items: unknown[]; label: string; value: string[] }) => unknown;
}>();

const props = withDefaults(defineProps<ComboboxTriggerValueProps>(), {
  asChild: false,
});
const combobox = useComboboxContext();
const context = useKappaComboboxContext();
const resolvedSize = computed(() => props.size ?? context.size.value);
const selectedLabel = computed(() => combobox.value.valueAsString);
const selectedValue = computed(() => combobox.value.value);
const selectedItems = computed(() =>
  combobox.value.selectedItems ?? context.collection.value.findMany(combobox.value.value),
);
const displayLabel = computed(() => selectedLabel.value || props.placeholder || "Select an option");
</script>

<template>
  <Combobox.Trigger
    v-if="asChild"
    v-bind="$attrs"
    as-child
    :aria-describedby="context.describedBy.value"
    :data-invalid="context.invalid.value ? '' : undefined"
    data-slot="combobox-trigger-value"
  >
    <slot :items="selectedItems" :label="displayLabel" :value="selectedValue" />
  </Combobox.Trigger>

  <Combobox.Trigger
    v-else
    v-bind="$attrs"
    class="kappa-combobox__value-trigger"
    :class="`kappa-combobox__value-trigger--${resolvedSize}`"
    :aria-describedby="context.describedBy.value"
    :data-invalid="context.invalid.value ? '' : undefined"
    data-slot="combobox-trigger-value"
  >
    <span
      class="kappa-combobox__value-trigger-label"
      :data-placeholder="selectedLabel ? undefined : ''"
    >
      <slot :items="selectedItems" :label="displayLabel" :value="selectedValue">
        {{ displayLabel }}
      </slot>
    </span>
    <span class="kappa-combobox__caret-icon" aria-hidden="true"></span>
  </Combobox.Trigger>
</template>
