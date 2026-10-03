<script setup lang="ts">
import { QrCode as ArkQrCode } from "@ark-ui/vue/qr-code";
import { computed } from "vue";
import { useQrCode } from "./use-qr-code";
import type { QrCodeRootEmits, QrCodeRootProps, QrCodeRootSlots } from "./qr-code";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<QrCodeRootProps>(), {
  asChild: undefined,
  defaultValue: undefined,
  encoding: undefined,
  id: undefined,
  ids: undefined,
  modelValue: undefined,
  pixelSize: undefined,
});

const emit = defineEmits<QrCodeRootEmits>();
defineSlots<QrCodeRootSlots>();

const machine = useQrCode(
  computed(() => ({
    defaultValue: props.defaultValue,
    encoding: props.encoding,
    id: props.id,
    ids: props.ids,
    modelValue: props.modelValue,
    pixelSize: props.pixelSize,
  })),
  emit,
);
</script>

<template>
  <ArkQrCode.RootProvider
    v-bind="$attrs"
    class="kappa-qr-code"
    data-slot="qr-code"
    :as-child="props.asChild"
    :value="machine"
  >
    <slot />
  </ArkQrCode.RootProvider>
</template>

<style src="./qr-code.css"></style>
