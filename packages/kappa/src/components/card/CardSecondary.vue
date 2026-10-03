<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_SECONDARY_DEFAULT_ELEMENT,
  resolveCardSecondaryElement,
  type CardSecondaryProps,
  type CardSecondarySlots,
} from "./card";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CardSecondaryProps>(), { as: CARD_SECONDARY_DEFAULT_ELEMENT });
defineSlots<CardSecondarySlots>();
const resolvedElement = computed(() => resolveCardSecondaryElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-card__secondary"
    data-slot="card-secondary"
  >
    <slot />
  </component>
</template>
