<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_ACTION_DEFAULT_ELEMENT,
  resolveCardActionElement,
  type CardActionProps,
  type CardActionSlots,
} from "./card";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<CardActionProps>(), { as: CARD_ACTION_DEFAULT_ELEMENT });
defineSlots<CardActionSlots>();
const resolvedElement = computed(() => resolveCardActionElement(props.as));
</script>

<template>
  <component :is="resolvedElement" v-bind="$attrs" class="kappa-card__action" data-slot="card-action">
    <slot />
  </component>
</template>
