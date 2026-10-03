<script setup lang="ts">
import { DownloadTrigger as ArkDownloadTrigger } from "@ark-ui/vue/download-trigger";
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
import type { DownloadTriggerProps, DownloadTriggerSlots } from "./download-trigger";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DownloadTriggerProps>(), {
  asChild: undefined,
  data: undefined,
  disabled: false,
  fullWidth: false,
  icon: undefined,
  iconPosition: BUTTON_DEFAULT_ICON_POSITION,
  iconProps: undefined,
  fileName: undefined,
  loading: false,
  mimeType: undefined,
  shape: BUTTON_DEFAULT_SHAPE,
  size: BUTTON_DEFAULT_SIZE,
  title: undefined,
  variant: BUTTON_DEFAULT_VARIANT,
});

defineSlots<DownloadTriggerSlots>();

const resolvedVariant = computed(() => resolveButtonVariant(props.variant));
const resolvedSize = computed(() => resolveButtonSize(props.size));
const resolvedShape = computed(() => resolveButtonShape(props.shape));
const resolvedIconPosition = computed(() => resolveButtonIconPosition(props.iconPosition));
const resolvedTitle = computed(() =>
  props.title === undefined ? undefined : String(props.title),
);
</script>

<template>
  <ArkDownloadTrigger
    v-bind="$attrs"
    class="kappa-button kappa-download-trigger"
    :class="{
      'kappa-button--full-width': props.fullWidth,
      'kappa-button--loading': props.loading,
    }"
    data-slot="download-trigger"
    :data-icon-position="resolvedIconPosition"
    :data-loading="props.loading ? '' : undefined"
    :data-shape="resolvedShape"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
    :aria-busy="props.loading ? 'true' : undefined"
    :as-child="props.asChild"
    :data="props.data"
    :disabled="props.disabled || props.loading"
    :file-name="props.fileName"
    :mime-type="props.mimeType"
    :title="resolvedTitle"
  >
    <slot v-if="props.asChild" />
    <template v-else>
      <span
        v-if="props.loading"
        aria-hidden="true"
        class="kappa-button__icon kappa-button__spinner"
        data-slot="download-trigger-spinner"
        :data-position="resolvedIconPosition"
      />
      <component
        :is="props.icon"
        v-else-if="props.icon"
        v-bind="props.iconProps"
        aria-hidden="true"
        class="kappa-button__icon"
        data-icon=""
        data-slot="download-trigger-icon"
        :data-position="resolvedIconPosition"
        focusable="false"
      />
      <span class="kappa-button__label" data-slot="download-trigger-label">
        <slot />
      </span>
    </template>
  </ArkDownloadTrigger>
</template>

<style src="../button/button.css"></style>
<style src="./download-trigger.css"></style>
