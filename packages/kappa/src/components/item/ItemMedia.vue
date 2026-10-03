<script setup lang="ts">
import { computed } from "vue";
import {
  ITEM_MEDIA_DEFAULT_VARIANT,
  resolveItemMediaVariant,
  type ItemMediaProps,
  type ItemMediaSlots,
} from "./item";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ItemMediaProps>(), {
  variant: ITEM_MEDIA_DEFAULT_VARIANT,
});

defineSlots<ItemMediaSlots>();

const resolvedVariant = computed(() => resolveItemMediaVariant(props.variant));
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-item__media"
    data-slot="item-media"
    :data-variant="resolvedVariant"
  >
    <slot />
  </div>
</template>
