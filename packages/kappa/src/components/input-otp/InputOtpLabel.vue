<script setup lang="ts">
import { PinInput as ArkPinInput } from "@ark-ui/vue/pin-input";
import type { InputOtpLabelProps, InputOtpLabelSlots } from "./input-otp";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputOtpLabelProps>(), {
  asChild: undefined,
});

defineSlots<InputOtpLabelSlots>();
</script>

<template>
  <ArkPinInput.Label
    v-bind="$attrs"
    class="kappa-input-otp__label"
    data-slot="input-otp-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkPinInput.Label>
</template>

<style src="./input-otp.css"></style>
