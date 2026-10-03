<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_HEADER_DEFAULT_ELEMENT,
  resolveCardHeaderElement,
  type CardHeaderProps,
  type CardHeaderSlots,
} from "./card";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CardHeaderProps>(), { as: CARD_HEADER_DEFAULT_ELEMENT });
defineSlots<CardHeaderSlots>();
const resolvedElement = computed(() => resolveCardHeaderElement(props.as));
</script>

<template>
  <component :is="resolvedElement" v-bind="$attrs" class="kappa-card__header" data-slot="card-header">
    <slot />
  </component>
</template>
