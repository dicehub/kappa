<script setup lang="ts">
import { computed } from "vue";
import {
  EMPTY_TITLE_DEFAULT_ELEMENT,
  resolveEmptyTitleElement,
  type EmptyTitleProps,
  type EmptyTitleSlots,
} from "./empty";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EmptyTitleProps>(), {
  as: EMPTY_TITLE_DEFAULT_ELEMENT,
});

defineSlots<EmptyTitleSlots>();

const resolvedElement = computed(() => resolveEmptyTitleElement(props.as));
</script>

<template>
  <component
    :is="resolvedElement"
    v-bind="$attrs"
    class="kappa-empty__title"
    data-slot="empty-title"
  >
    <slot />
  </component>
</template>
