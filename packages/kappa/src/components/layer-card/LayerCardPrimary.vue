<script setup lang="ts">
import { computed } from "vue";
import {
  LAYER_CARD_PRIMARY_DEFAULT_ELEMENT,
  resolveLayerCardPrimaryElement,
  type LayerCardPrimaryProps,
  type LayerCardPrimarySlots,
} from "./layer-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LayerCardPrimaryProps>(), {
  as: LAYER_CARD_PRIMARY_DEFAULT_ELEMENT,
});

defineSlots<LayerCardPrimarySlots>();

const resolvedElement = computed(() => resolveLayerCardPrimaryElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-layer-card__primary"
    data-slot="layer-card-primary"
  >
    <slot />
  </component>
</template>
