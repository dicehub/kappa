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
  <ArkQrCode.Pattern
    v-bind="$attrs"
    class="kappa-qr-code__pattern"
    data-slot="qr-code-pattern"
    fill="var(--kappa-qr-code-foreground, #111318)"
    :as-child="props.asChild"
  >
    <slot />
  </ArkQrCode.Pattern>
</template>
