<script setup lang="ts">
import { useComboboxContext } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import type { ComboboxValueProps } from "./combobox";
import { useKappaComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

defineProps<ComboboxValueProps>();

const combobox = useComboboxContext();
const context = useKappaComboboxContext();
const selectedLabel = computed(() => combobox.value.valueAsString);
const selectedValue = computed(() => combobox.value.value);
const selectedItems = computed(() =>
  combobox.value.selectedItems ?? context.collection.value.findMany(combobox.value.value),
);
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-combobox__value"
    :data-placeholder="selectedLabel ? undefined : ''"
    data-slot="combobox-value"
  >
    <slot :items="selectedItems" :value="selectedValue">
      {{ selectedLabel || placeholder || "Select an option" }}
    </slot>
  </span>
</template>
