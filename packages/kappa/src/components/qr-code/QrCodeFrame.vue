<script setup lang="ts">
import { QrCode as ArkQrCode } from "@ark-ui/vue/qr-code";
import type { QrCodeFrameProps, QrCodeFrameSlots } from "./qr-code";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<QrCodeFrameProps>(), {
  asChild: undefined,
});

defineSlots<QrCodeFrameSlots>();
</script>

<template>
  <ArkQrCode.Frame
    v-bind="$attrs"
    class="kappa-qr-code__frame"
    data-slot="qr-code-frame"
    shape-rendering="crispEdges"
    :as-child="props.asChild"
  >
    <rect
      v-if="!props.asChild"
      width="100%"
      height="100%"
      fill="var(--kappa-qr-code-background, #ffffff)"
      data-slot="qr-code-background"
    />
    <slot />
  </ArkQrCode.Frame>
</template>
