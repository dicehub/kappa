<script setup lang="ts">
import { computed } from "vue";
import {
  LAYER_CARD_ROOT_DEFAULT_ELEMENT,
  resolveLayerCardRootElement,
  type LayerCardRootProps,
  type LayerCardRootSlots,
} from "./layer-card";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LayerCardRootProps>(), {
  as: LAYER_CARD_ROOT_DEFAULT_ELEMENT,
});

defineSlots<LayerCardRootSlots>();

const resolvedElement = computed(() => resolveLayerCardRootElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-layer-card"
    data-slot="layer-card"
  >
    <slot />
  </component>
</template>

<style src="./layer-card.css"></style>
