<script setup lang="ts">
import { RadioGroup as ArkRadioGroup } from "@ark-ui/vue/radio-group";
import { useFieldContext } from "@ark-ui/vue/field";
import { computed } from "vue";
import type { RadioItemProps, RadioItemSlots } from "./radio";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioItemProps>(), {
  disabled: undefined,
  invalid: undefined,
});

defineSlots<RadioItemSlots>();

const field = useFieldContext();
const fieldErrorMessageId = computed(
  () => field?.value.getInputProps()["aria-errormessage"],
);
</script>

<template>
  <ArkRadioGroup.Item
    v-bind="$attrs"
    class="kappa-radio__item"
    data-slot="radio-item"
    :disabled="props.disabled"
    :invalid="props.invalid"
    :value="props.value"
  >
    <ArkRadioGroup.ItemHiddenInput
      :aria-errormessage="fieldErrorMessageId"
      data-slot="radio-item-hidden-input"
    />
    <slot />
  </ArkRadioGroup.Item>
</template>

<style src="./radio.css"></style>
