<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_PRIMARY_DEFAULT_ELEMENT,
  resolveCardPrimaryElement,
  type CardPrimaryProps,
  type CardPrimarySlots,
} from "./card";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CardPrimaryProps>(), { as: CARD_PRIMARY_DEFAULT_ELEMENT });
defineSlots<CardPrimarySlots>();
const resolvedElement = computed(() => resolveCardPrimaryElement(props.as));
</script>

<template>
  <component :is="resolvedElement" v-bind="$attrs" class="kappa-card__primary" data-slot="card-primary">
    <slot />
  </component>
</template>
