<script setup lang="ts">
import { QrCode as ArkQrCode } from "@ark-ui/vue/qr-code";
import type { QrCodeRootProviderProps, QrCodeRootProviderSlots } from "./qr-code";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<QrCodeRootProviderProps>(), {
  asChild: undefined,
});

defineSlots<QrCodeRootProviderSlots>();
</script>

<template>
  <ArkQrCode.RootProvider
    v-bind="$attrs"
    class="kappa-qr-code"
    data-slot="qr-code"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkQrCode.RootProvider>
</template>

<style src="./qr-code.css"></style>
