<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_CONTENT_DEFAULT_ELEMENT,
  resolveCardContentElement,
  type CardContentProps,
  type CardContentSlots,
} from "./card";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CardContentProps>(), { as: CARD_CONTENT_DEFAULT_ELEMENT });
defineSlots<CardContentSlots>();
const resolvedElement = computed(() => resolveCardContentElement(props.as));
</script>

<template>
  <component :is="resolvedElement" v-bind="$attrs" class="kappa-card__content" data-slot="card-content">
    <slot />
  </component>
</template>
