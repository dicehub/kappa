<script setup lang="ts">
import { computed } from "vue";
import DicehubLogo from "./DicehubLogo.vue";
import { DICEHUB_LOGO_DEFAULT_COLOR, type DicehubLogoColor } from "./dicehub-logo";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    color?: DicehubLogoColor;
    href?: string;
    rel?: string;
    target?: string;
  }>(),
  {
    color: DICEHUB_LOGO_DEFAULT_COLOR,
    href: "https://dicehub.com",
    target: "_blank",
  },
);

const resolvedRel = computed(() => props.rel ?? (props.target === "_blank" ? "noopener noreferrer" : undefined));
</script>

<template>
  <a
    v-bind="$attrs"
    class="kappa-powered-by-dicehub"
    :class="`kappa-powered-by-dicehub--${color}`"
    :href="href"
    :rel="resolvedRel"
    :target="target"
  >
    <DicehubLogo
      class="kappa-powered-by-dicehub__mark"
      variant="glyph"
      :color="color"
      aria-hidden="true"
    />
    <span>Powered by <strong>dicehub</strong></span>
  </a>
</template>

<style src="./dicehub-logo.css"></style>
