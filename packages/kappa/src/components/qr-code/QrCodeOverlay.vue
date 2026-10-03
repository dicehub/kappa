<script setup lang="ts">
import { QrCode as ArkQrCode } from "@ark-ui/vue/qr-code";
import type { QrCodePartProps, QrCodePartSlots } from "./qr-code";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<QrCodePartProps>(), {
  asChild: undefined,
});

defineSlots<QrCodePartSlots>();
</script>

<template>
  <ArkQrCode.Overlay
    v-bind="$attrs"
    class="kappa-qr-code__overlay"
    data-slot="qr-code-overlay"
    :as-child="props.asChild"
  >
    <slot />
  </ArkQrCode.Overlay>
</template>
