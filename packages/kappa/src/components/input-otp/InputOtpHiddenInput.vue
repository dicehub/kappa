<script setup lang="ts">
import { PinInput as ArkPinInput } from "@ark-ui/vue/pin-input";
import type { InputOtpHiddenInputProps, InputOtpHiddenInputSlots } from "./input-otp";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Pick<InputOtpHiddenInputProps, "asChild">>(), {
  asChild: undefined,
});

defineSlots<InputOtpHiddenInputSlots>();
</script>

<template>
  <ArkPinInput.HiddenInput
    v-bind="$attrs"
    data-slot="input-otp-hidden-input"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPinInput.HiddenInput>
</template>

<style src="./input-otp.css"></style>
