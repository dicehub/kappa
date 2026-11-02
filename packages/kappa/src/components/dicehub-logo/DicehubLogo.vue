<script setup lang="ts">
import { computed } from "vue";
import {
  DICEHUB_LOGO_DEFAULT_COLOR,
  DICEHUB_LOGO_DEFAULT_VARIANT,
  DICEHUB_GLYPH_PATHS,
  getDicehubLogoArtwork,
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
const artwork = computed(() => getDicehubLogoArtwork(resolvedVariant.value));
// Keep each face and its inset mark together without changing the source paths.
const glyphFaces = [
  { name: "top", hitArea: "16 0 33 9 16 18 0 9", paths: [DICEHUB_GLYPH_PATHS[0], DICEHUB_GLYPH_PATHS[1]] },
  { name: "right", hitArea: "16 18 33 9 33 27 16 36", paths: [DICEHUB_GLYPH_PATHS[2]] },
  { name: "left", hitArea: "0 9 16 18 16 36 0 27", paths: [DICEHUB_GLYPH_PATHS[3], DICEHUB_GLYPH_PATHS[4]] },
] as const;
</script>

<template>
  <svg
    v-bind="$attrs"
    class="kappa-dicehub-logo"
    :class="[`kappa-dicehub-logo--${resolvedVariant}`, `kappa-dicehub-logo--${resolvedColor}`]"
    :viewBox="artwork.viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="title"
  >
    <template v-if="resolvedVariant === 'glyph'">
      <g v-for="face in glyphFaces" :key="face.name" class="kappa-dicehub-logo__face" :data-face="face.name">
        <!-- Shell brand links opt into continuous hit areas over the artwork's cutouts. -->
        <polygon class="kappa-dicehub-logo__hit-area" :points="face.hitArea" fill="none" stroke="none" visibility="hidden" pointer-events="none" />
        <path v-for="path in face.paths" :key="path" :d="path" fill="currentColor" />
      </g>
    </template>
    <template v-else>
      <path v-for="path in artwork.paths" :key="path" :d="path" fill="currentColor" />
    </template>
  </svg>
</template>

<style src="./dicehub-logo.css"></style>
