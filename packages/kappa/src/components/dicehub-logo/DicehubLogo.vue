<script setup lang="ts">
import { computed } from "vue";
import {
  DICEHUB_FULL_LOGO_PATHS,
  DICEHUB_FULL_LOGO_VIEWBOX,
  DICEHUB_GLYPH_PATHS,
  DICEHUB_GLYPH_VIEWBOX,
  DICEHUB_LOGO_DEFAULT_COLOR,
  DICEHUB_LOGO_DEFAULT_VARIANT,
  isDicehubLogoColor,
  isDicehubLogoVariant,
  type DicehubLogoColor,
  type DicehubLogoVariant,
} from "./dicehub-logo";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    color?: DicehubLogoColor;
    title?: string;
    variant?: DicehubLogoVariant;
  }>(),
  {
    color: DICEHUB_LOGO_DEFAULT_COLOR,
    title: "dicehub logo",
    variant: DICEHUB_LOGO_DEFAULT_VARIANT,
  },
);

const resolvedVariant = computed(() =>
  isDicehubLogoVariant(props.variant) ? props.variant : DICEHUB_LOGO_DEFAULT_VARIANT,
);
const resolvedColor = computed(() => (isDicehubLogoColor(props.color) ? props.color : DICEHUB_LOGO_DEFAULT_COLOR));
const isGlyph = computed(() => resolvedVariant.value === "glyph");
const viewBox = computed(() => (isGlyph.value ? DICEHUB_GLYPH_VIEWBOX : DICEHUB_FULL_LOGO_VIEWBOX));
const paths = computed(() => (isGlyph.value ? DICEHUB_GLYPH_PATHS : DICEHUB_FULL_LOGO_PATHS));
</script>

<template>
  <svg
    v-bind="$attrs"
    class="kappa-dicehub-logo"
    :class="[`kappa-dicehub-logo--${resolvedVariant}`, `kappa-dicehub-logo--${resolvedColor}`]"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="title"
  >
    <path v-for="path in paths" :key="path" :d="path" fill="currentColor" />
  </svg>
</template>

<style src="./dicehub-logo.css"></style>
