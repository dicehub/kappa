<script setup lang="ts">
import { computed } from "vue";
import {
  BANNER_ACTION_DEFAULT_SIZE,
  BANNER_ACTION_DEFAULT_TYPE,
  BANNER_ACTION_DEFAULT_VARIANT,
  resolveBannerActionType,
  resolveBannerActionVariant,
  type BannerActionProps,
  type BannerActionSlots,
} from "./banner";
import { useBannerContext } from "./banner-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BannerActionProps>(), {
  disabled: false,
  type: BANNER_ACTION_DEFAULT_TYPE,
  variant: BANNER_ACTION_DEFAULT_VARIANT,
});

defineSlots<BannerActionSlots>();

const banner = useBannerContext();
const resolvedVariant = computed(() => resolveBannerActionVariant(props.variant));
const resolvedType = computed(() => resolveBannerActionType(props.type));
const resolvedSize = computed(() => banner?.actionSize.value ?? BANNER_ACTION_DEFAULT_SIZE);
</script>

<template>
  <button
    v-bind="$attrs"
    class="kappa-banner-action"
    :class="[
      `kappa-banner-action--${resolvedVariant}`,
      `kappa-banner-action--${resolvedSize}`,
    ]"
    data-slot="banner-action"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
    :disabled="disabled"
    :type="resolvedType"
  >
    <slot />
  </button>
</template>

<style src="./banner-action.css"></style>
