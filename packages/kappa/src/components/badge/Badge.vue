<script setup lang="ts">
import { computed } from "vue";
import {
  BADGE_DEFAULT_ELEMENT,
  BADGE_DEFAULT_VARIANT,
  isBadgeElement,
  isBadgeVariant,
  type BadgeProps,
} from "./badge";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BadgeProps>(), {
  as: BADGE_DEFAULT_ELEMENT,
  variant: BADGE_DEFAULT_VARIANT,
});

const resolvedElement = computed(() =>
  isBadgeElement(props.as) ? props.as : BADGE_DEFAULT_ELEMENT,
);
const resolvedVariant = computed(() =>
  isBadgeVariant(props.variant) ? props.variant : BADGE_DEFAULT_VARIANT,
);
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-badge"
    :class="`kappa-badge--${resolvedVariant}`"
    data-slot="badge"
    :data-variant="resolvedVariant"
  >
    <slot />
  </component>
</template>

<style src="./badge.css"></style>
