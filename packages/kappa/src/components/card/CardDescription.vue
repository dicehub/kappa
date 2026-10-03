<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_DESCRIPTION_DEFAULT_ELEMENT,
  resolveCardDescriptionElement,
  type CardDescriptionProps,
  type CardDescriptionSlots,
} from "./card";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CardDescriptionProps>(), {
  as: CARD_DESCRIPTION_DEFAULT_ELEMENT,
});
defineSlots<CardDescriptionSlots>();
const resolvedElement = computed(() => resolveCardDescriptionElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-card__description"
    data-slot="card-description"
  >
    <slot />
  </component>
</template>
