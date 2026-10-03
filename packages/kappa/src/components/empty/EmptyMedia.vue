<script setup lang="ts">
import { computed } from "vue";
import {
  EMPTY_MEDIA_DEFAULT_VARIANT,
  resolveEmptyMediaVariant,
  type EmptyMediaProps,
  type EmptyMediaSlots,
} from "./empty";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EmptyMediaProps>(), {
  variant: EMPTY_MEDIA_DEFAULT_VARIANT,
});

defineSlots<EmptyMediaSlots>();

const resolvedVariant = computed(() => resolveEmptyMediaVariant(props.variant));
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-empty__media"
    :class="`kappa-empty__media--${resolvedVariant}`"
    data-slot="empty-media"
    :data-variant="resolvedVariant"
  >
    <slot />
  </div>
</template>
