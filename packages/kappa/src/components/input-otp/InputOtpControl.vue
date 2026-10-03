<script setup lang="ts">
import { PinInput as ArkPinInput } from "@ark-ui/vue/pin-input";
import type { InputOtpControlProps, InputOtpControlSlots } from "./input-otp";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputOtpControlProps>(), {
  asChild: undefined,
});

defineSlots<InputOtpControlSlots>();
</script>

<template>
  <ArkPinInput.Control
    v-bind="$attrs"
    class="kappa-input-otp__control"
    data-slot="input-otp-control"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPinInput.Control>
</template>

<style src="./input-otp.css"></style>
