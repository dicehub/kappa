<script setup lang="ts">
import { computed } from "vue";
import {
  CARD_DEFAULT_SIZE,
  CARD_ROOT_DEFAULT_ELEMENT,
  resolveCardRootElement,
  resolveCardSize,
  type CardRootProps,
  type CardRootSlots,
} from "./card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CardRootProps>(), {
  as: CARD_ROOT_DEFAULT_ELEMENT,
  size: CARD_DEFAULT_SIZE,
});

defineSlots<CardRootSlots>();

const resolvedElement = computed(() => resolveCardRootElement(props.as));
const resolvedSize = computed(() => resolveCardSize(props.size));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-card"
    data-slot="card"
    :data-size="resolvedSize"
  >
    <slot />
  </component>
</template>

<style src="./card.css"></style>
