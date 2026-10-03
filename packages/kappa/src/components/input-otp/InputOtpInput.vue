<script setup lang="ts">
import { PinInput as ArkPinInput } from "@ark-ui/vue/pin-input";
import type { InputOtpInputProps, InputOtpInputSlots } from "./input-otp";

defineOptions({ inheritAttrs: false });

const props = defineProps<InputOtpInputProps>();
defineSlots<InputOtpInputSlots>();
</script>

<template>
  <ArkPinInput.Input
    v-bind="$attrs"
    class="kappa-input-otp__input"
    data-slot="input-otp-input"
    :as-child="props.asChild"
    :index="props.index"
  >
    <slot />
  </ArkPinInput.Input>
</template>

<style src="./input-otp.css"></style>
