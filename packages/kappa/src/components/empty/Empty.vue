<script setup lang="ts">
import { computed } from "vue";
import {
  EMPTY_DEFAULT_SIZE,
  resolveEmptySize,
  type EmptyRootProps,
  type EmptyRootSlots,
} from "./empty";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<EmptyRootProps>(), {
  size: EMPTY_DEFAULT_SIZE,
});

defineSlots<EmptyRootSlots>();

const resolvedSize = computed(() => resolveEmptySize(props.size));
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-empty"
    :class="`kappa-empty--${resolvedSize}`"
    data-slot="empty"
    :data-size="resolvedSize"
  >
    <slot />
  </div>
</template>

<style src="./empty.css"></style>
