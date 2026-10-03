<script setup lang="ts">
import type {
  NumberInputFocusChangeDetails,
  NumberInputValueChangeDetails,
  NumberInputValueInvalidDetails,
  UseNumberInputProps,
} from "@ark-ui/vue/number-input";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import NumberInputMachine from "./NumberInputMachine.vue";
import { provideNumberInputScrubSteps } from "./number-input-scrub-steps";
import {
  NUMBER_INPUT_DEFAULT_SIZE,
  type NumberInputEmits,
  type NumberInputProps,
  type NumberInputSlots,
} from "./number-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberInputProps>(), {
  allowMouseWheel: undefined,
  allowOverflow: undefined,
  asChild: undefined,
  clampValueOnBlur: undefined,
  defaultValue: undefined,
  dir: undefined,
  disabled: undefined,
  focusInputOnChange: undefined,
  form: undefined,
  formatOptions: undefined,
  id: undefined,
  ids: undefined,
  inputMode: undefined,
  invalid: undefined,
  largeStep: undefined,
  locale: undefined,
  max: undefined,
  min: undefined,
  modelValue: undefined,
  name: undefined,
  pattern: undefined,
  readOnly: undefined,
  required: undefined,
  size: NUMBER_INPUT_DEFAULT_SIZE,
  smallStep: undefined,
  spinOnPress: undefined,
  step: undefined,
  translations: undefined,
});

const emit = defineEmits<NumberInputEmits>();
defineSlots<NumberInputSlots>();

const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const numberLocale = computed(() => props.locale ?? inheritedLocale.value.locale);
const providerLocale = computed(() => {
  if (props.dir !== undefined) return props.dir === "rtl" ? "ar" : "en-US";
  return numberLocale.value;
});

provideNumberInputScrubSteps(() => ({
  formatOptions: props.formatOptions,
  largeStep: props.largeStep,
  smallStep: props.smallStep,
  step: props.step,
}));

const handleFocusChange = (details: NumberInputFocusChangeDetails) =>
  emit("focusChange", details);
const handleValueChange = (details: NumberInputValueChangeDetails) => {
  emit("valueChange", details);
  emit("update:modelValue", details.value);
};
const handleValueCommit = (details: NumberInputValueChangeDetails) =>
  emit("valueCommit", details);
const handleValueInvalid = (details: NumberInputValueInvalidDetails) =>
  emit("valueInvalid", details);

const machineProps = computed<UseNumberInputProps>(() => ({
  allowMouseWheel: props.allowMouseWheel,
  allowOverflow: props.allowOverflow,
  clampValueOnBlur: props.clampValueOnBlur,
  defaultValue: props.defaultValue,
  disabled: props.disabled,
  focusInputOnChange: props.focusInputOnChange,
  form: props.form,
  formatOptions: props.formatOptions,
  id: props.id,
  ids: props.ids,
  inputMode: props.inputMode,
  invalid: props.invalid,
  largeStep: props.largeStep,
  locale: numberLocale.value,
  max: props.max,
  min: props.min,
  modelValue: props.modelValue,
  name: props.name,
  onFocusChange: handleFocusChange,
  onValueChange: handleValueChange,
  onValueCommit: handleValueCommit,
  onValueInvalid: handleValueInvalid,
  pattern: props.pattern,
  readOnly: props.readOnly,
  required: props.required,
  smallStep: props.smallStep,
  spinOnPress: props.spinOnPress,
  step: props.step,
  translations: props.translations,
}));
</script>

<template>
  <LocaleProvider :locale="providerLocale">
    <NumberInputMachine
      v-bind="$attrs"
      :allow-mouse-wheel="props.allowMouseWheel"
      :as-child="props.asChild"
      :machine-props="machineProps"
      :size="props.size"
    >
      <slot />
    </NumberInputMachine>
  </LocaleProvider>
</template>

<style src="./number-input.css"></style>
