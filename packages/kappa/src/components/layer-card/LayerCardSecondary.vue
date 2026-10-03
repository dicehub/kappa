<script setup lang="ts">
import { computed } from "vue";
import {
  LAYER_CARD_SECONDARY_DEFAULT_ELEMENT,
  resolveLayerCardSecondaryElement,
  type LayerCardSecondaryProps,
  type LayerCardSecondarySlots,
} from "./layer-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LayerCardSecondaryProps>(), {
  as: LAYER_CARD_SECONDARY_DEFAULT_ELEMENT,
});

defineSlots<LayerCardSecondarySlots>();

const resolvedElement = computed(() => resolveLayerCardSecondaryElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-layer-card__secondary"
    data-slot="layer-card-secondary"
  >
    <slot />
  </component>
</template>
