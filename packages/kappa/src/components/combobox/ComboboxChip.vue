<script setup lang="ts">
import { useComboboxContext } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import type { ComboboxChipProps } from "./combobox";
import { useKappaComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ComboboxChipProps>(), {
  removable: true,
});
const combobox = useComboboxContext();
const context = useKappaComboboxContext();
const resolvedValue = computed(
  () => props.value ?? context.collection.value.getItemValue(props.item) ?? "",
);
const resolvedLabel = computed(
  () => context.collection.value.stringifyItem(props.item) ?? resolvedValue.value,
);
const canRemove = computed(
  () => props.removable && !context.disabled.value && !context.readOnly.value,
);

const remove = () => {
  if (!resolvedValue.value || !canRemove.value) return;
  combobox.value.setValue(combobox.value.value.filter((value) => value !== resolvedValue.value));
};
</script>

<template>
  <span v-bind="$attrs" class="kappa-combobox__chip" data-slot="combobox-chip">
    <span class="kappa-combobox__chip-label"><slot>{{ resolvedLabel }}</slot></span>
    <button
      v-if="canRemove"
      class="kappa-combobox__chip-remove"
      type="button"
      :aria-label="`Remove ${resolvedLabel}`"
      @click.stop.prevent="remove"
    >
      <span class="kappa-combobox__clear-icon" aria-hidden="true"></span>
    </button>
  </span>
</template>

<style src="./combobox-multiple.css"></style>
