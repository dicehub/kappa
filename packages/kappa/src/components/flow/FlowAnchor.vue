<script setup lang="ts">
import { computed } from "vue";
import type { FlowAnchorProps, FlowAnchorSlots } from "./flow";

defineOptions({ inheritAttrs: false });

const props = defineProps<FlowAnchorProps>();
defineSlots<FlowAnchorSlots>();

const anchorType = computed(() => props.type ?? "start end");
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-flow-anchor"
    data-slot="flow-anchor"
    :data-flow-anchor="anchorType"
  >
    <slot />
  </div>
</template>
