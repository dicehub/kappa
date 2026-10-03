<script setup lang="ts">
import { PinInput as ArkPinInput } from "@ark-ui/vue/pin-input";
import type { InputOtpContextSlots } from "./input-otp";

defineSlots<InputOtpContextSlots>();
</script>

<template>
  <ArkPinInput.Context v-slot="context">
    <slot v-bind="context" />
  </ArkPinInput.Context>
</template>
