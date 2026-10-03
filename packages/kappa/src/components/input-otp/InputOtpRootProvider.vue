<script setup lang="ts">
import { PinInput as ArkPinInput } from "@ark-ui/vue/pin-input";
import { computed } from "vue";
import {
  INPUT_OTP_DEFAULT_SIZE,
  resolveInputOtpSize,
  type InputOtpRootProviderProps,
  type InputOtpRootProviderSlots,
} from "./input-otp";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputOtpRootProviderProps>(), {
  asChild: undefined,
  size: INPUT_OTP_DEFAULT_SIZE,
});

defineSlots<InputOtpRootProviderSlots>();

const resolvedSize = computed(() => resolveInputOtpSize(props.size));
</script>

<template>
  <ArkPinInput.RootProvider
    v-bind="$attrs"
    class="kappa-input-otp"
    data-slot="input-otp"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkPinInput.RootProvider>
</template>

<style src="./input-otp.css"></style>
