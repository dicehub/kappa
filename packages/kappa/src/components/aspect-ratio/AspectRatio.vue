<script setup lang="ts">
import { computed, useAttrs } from "vue";
import type { StyleValue } from "vue";
import {
  resolveAspectRatio,
  type AspectRatioProps,
  type AspectRatioSlots,
} from "./aspect-ratio";

defineOptions({ inheritAttrs: false });

const props = defineProps<AspectRatioProps>();

defineSlots<AspectRatioSlots>();

const attrs = useAttrs();
const resolvedRatio = computed(() => resolveAspectRatio(props.ratio));
const rootStyle = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  { "--kappa-aspect-ratio": String(resolvedRatio.value) },
]);
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-aspect-ratio"
    data-slot="aspect-ratio"
    :data-ratio="resolvedRatio"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>

<style src="./aspect-ratio.css"></style>
