<script setup lang="ts">
import { QrCode as ArkQrCode } from "@ark-ui/vue/qr-code";
import { computed } from "vue";
import {
  BUTTON_DEFAULT_ICON_POSITION,
  BUTTON_DEFAULT_SHAPE,
  BUTTON_DEFAULT_SIZE,
  BUTTON_DEFAULT_VARIANT,
  resolveButtonIconPosition,
  resolveButtonShape,
  resolveButtonSize,
  resolveButtonVariant,
} from "../button";
import type { QrCodeDownloadTriggerProps, QrCodePartSlots } from "./qr-code";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<QrCodeDownloadTriggerProps>(), {
  asChild: undefined,
  disabled: false,
  fileName: undefined,
  fullWidth: false,
  icon: undefined,
  iconPosition: BUTTON_DEFAULT_ICON_POSITION,
  iconProps: undefined,
  mimeType: undefined,
  quality: undefined,
  shape: BUTTON_DEFAULT_SHAPE,
  size: BUTTON_DEFAULT_SIZE,
  title: undefined,
  variant: BUTTON_DEFAULT_VARIANT,
});

defineSlots<QrCodePartSlots>();

const resolvedVariant = computed(() => resolveButtonVariant(props.variant));
const resolvedSize = computed(() => resolveButtonSize(props.size));
const resolvedShape = computed(() => resolveButtonShape(props.shape));
const resolvedIconPosition = computed(() => resolveButtonIconPosition(props.iconPosition));
</script>

<template>
  <ArkQrCode.DownloadTrigger
    v-bind="$attrs"
    class="kappa-button kappa-qr-code__download-trigger"
    :class="{ 'kappa-button--full-width': props.fullWidth }"
    data-slot="qr-code-download-trigger"
    :data-icon-position="resolvedIconPosition"
    :data-shape="resolvedShape"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
    :as-child="props.asChild"
    :disabled="props.disabled"
    :file-name="props.fileName"
    :mime-type="props.mimeType"
    :quality="props.quality"
    :title="props.title === undefined ? undefined : String(props.title)"
  >
    <slot v-if="props.asChild" />
    <template v-else>
      <component
        :is="props.icon"
        v-if="props.icon"
        v-bind="props.iconProps"
        aria-hidden="true"
        class="kappa-button__icon"
        data-icon=""
        data-slot="qr-code-download-icon"
        :data-position="resolvedIconPosition"
        focusable="false"
      />
      <span class="kappa-button__label" data-slot="qr-code-download-label"><slot /></span>
    </template>
  </ArkQrCode.DownloadTrigger>
</template>

<style src="./qr-code-download-trigger.css"></style>
