<script setup lang="ts">
import { PinInput as ArkPinInput } from "@ark-ui/vue/pin-input";
import { computed } from "vue";
import {
  INPUT_OTP_DEFAULT_SIZE,
  resolveInputOtpSize,
  type InputOtpEmits,
  type InputOtpProps,
  type InputOtpRootSlots,
} from "./input-otp";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputOtpProps>(), {
  asChild: undefined,
  autoFocus: undefined,
  autoSubmit: undefined,
  blurOnComplete: undefined,
  count: undefined,
  defaultValue: undefined,
  disabled: undefined,
  form: undefined,
  id: undefined,
  ids: undefined,
  invalid: undefined,
  mask: undefined,
  modelValue: undefined,
  name: undefined,
  otp: undefined,
  pattern: undefined,
  placeholder: undefined,
  readOnly: undefined,
  required: undefined,
  sanitizeValue: undefined,
  selectOnFocus: undefined,
  translations: undefined,
  type: undefined,
  size: INPUT_OTP_DEFAULT_SIZE,
});

const emit = defineEmits<InputOtpEmits>();
defineSlots<InputOtpRootSlots>();

const resolvedSize = computed(() => resolveInputOtpSize(props.size));
</script>

<template>
  <ArkPinInput.Root
    v-bind="$attrs"
    class="kappa-input-otp"
    data-slot="input-otp"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :auto-focus="props.autoFocus"
    :auto-submit="props.autoSubmit"
    :blur-on-complete="props.blurOnComplete"
    :count="props.count"
    :default-value="props.defaultValue"
    :disabled="props.disabled"
    :form="props.form"
    :id="props.id"
    :ids="props.ids"
    :invalid="props.invalid"
    :mask="props.mask"
    :model-value="props.modelValue"
    :name="props.name"
    :otp="props.otp"
    :pattern="props.pattern"
    :placeholder="props.placeholder"
    :read-only="props.readOnly"
    :required="props.required"
    :sanitize-value="props.sanitizeValue"
    :select-on-focus="props.selectOnFocus"
    :translations="props.translations"
    :type="props.type"
    @value-change="emit('valueChange', $event)"
    @value-complete="emit('valueComplete', $event)"
    @value-invalid="emit('valueInvalid', $event)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </ArkPinInput.Root>
</template>

<style src="./input-otp.css"></style>
