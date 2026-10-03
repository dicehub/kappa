<script setup lang="ts">
import { Select as ArkSelect, useSelectContext } from "@ark-ui/vue/select";
import { computed } from "vue";
import type { SelectValueTextProps, SelectValueTextSlots } from "./select";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectValueTextProps>(), {
  placeholder: undefined,
  asChild: undefined,
});

defineSlots<SelectValueTextSlots>();

const select = useSelectContext();
const hasValue = computed(() => select.value.value.length > 0);
const displayValue = computed(
  () => select.value.valueAsString || props.placeholder || "Select an option",
);
</script>

<template>
  <ArkSelect.ValueText
    v-bind="$attrs"
    class="kappa-select__value"
    data-slot="select-value-text"
    :as-child="props.asChild"
    :data-placeholder="hasValue ? undefined : ''"
    :placeholder="props.placeholder"
  >
    <slot>{{ displayValue }}</slot>
  </ArkSelect.ValueText>
</template>

<style src="./select.css"></style>
