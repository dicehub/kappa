<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_FOOTER_DEFAULT_ELEMENT,
  resolveCardFooterElement,
  type CardFooterProps,
  type CardFooterSlots,
} from "./card";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CardFooterProps>(), { as: CARD_FOOTER_DEFAULT_ELEMENT });
defineSlots<CardFooterSlots>();
const resolvedElement = computed(() => resolveCardFooterElement(props.as));
</script>

<template>
  <component :is="resolvedElement" v-bind="$attrs" class="kappa-card__footer" data-slot="card-footer">
    <slot />
  </component>
</template>
