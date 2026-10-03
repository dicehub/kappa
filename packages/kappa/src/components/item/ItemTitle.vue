<script setup lang="ts">
import { computed } from "vue";
import {
  ITEM_TITLE_DEFAULT_ELEMENT,
  resolveItemTitleElement,
  type ItemTitleProps,
  type ItemTitleSlots,
} from "./item";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ItemTitleProps>(), {
  as: ITEM_TITLE_DEFAULT_ELEMENT,
});

defineSlots<ItemTitleSlots>();

const resolvedElement = computed(() => resolveItemTitleElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-item__title"
    data-slot="item-title"
    :data-as="resolvedElement"
  >
    <slot />
  </component>
</template>
