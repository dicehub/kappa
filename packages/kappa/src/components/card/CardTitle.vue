<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_TITLE_DEFAULT_ELEMENT,
  resolveCardTitleElement,
  type CardTitleProps,
  type CardTitleSlots,
} from "./card";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CardTitleProps>(), { as: CARD_TITLE_DEFAULT_ELEMENT });
defineSlots<CardTitleSlots>();
const resolvedElement = computed(() => resolveCardTitleElement(props.as));
</script>

<template>
  <component :is="resolvedElement" v-bind="$attrs" class="kappa-card__title" data-slot="card-title">
    <slot />
  </component>
</template>
