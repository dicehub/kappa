<script setup lang="ts">
import { QrCodeContext as ArkQrCodeContext } from "@ark-ui/vue/qr-code";
import type { QrCodeContextSlots } from "./qr-code";

defineSlots<QrCodeContextSlots>();
</script>

<template>
  <ArkQrCodeContext v-slot="context">
    <slot v-bind="context" />
  </ArkQrCodeContext>
</template>
