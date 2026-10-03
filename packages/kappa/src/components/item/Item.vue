<script setup lang="ts">
import { computed } from "vue";
import {
  ITEM_DEFAULT_SIZE,
  ITEM_DEFAULT_VARIANT,
  ITEM_ROOT_DEFAULT_ELEMENT,
  resolveItemRootElement,
  resolveItemSize,
  resolveItemVariant,
  type ItemRootProps,
  type ItemRootSlots,
} from "./item";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ItemRootProps>(), {
  as: ITEM_ROOT_DEFAULT_ELEMENT,
  size: ITEM_DEFAULT_SIZE,
  variant: ITEM_DEFAULT_VARIANT,
});

defineSlots<ItemRootSlots>();

const resolvedElement = computed(() => resolveItemRootElement(props.as));
const resolvedSize = computed(() => resolveItemSize(props.size));
const resolvedVariant = computed(() => resolveItemVariant(props.variant));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-item"
    data-slot="item"
    :data-as="resolvedElement"
    :data-size="resolvedSize"
    :data-variant="resolvedVariant"
  >
    <slot />
  </component>
</template>

<style src="./item.css"></style>
