<script setup lang="ts">
import type { FlowParallelProps, FlowParallelSlots } from "./flow";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FlowParallelProps>(), {
  align: "start",
});

defineSlots<FlowParallelSlots>();
</script>

<template>
  <li
    v-bind="$attrs"
    class="kappa-flow-parallel"
    data-flow-item
    data-flow-type="parallel"
    data-slot="flow-parallel"
    :data-flow-align="props.align"
  >
    <ul
      class="kappa-flow__parallel-list"
      :class="`kappa-flow__parallel-list--${props.align}`"
      data-flow-parallel-list
      data-slot="flow-parallel-list"
    >
      <slot />
    </ul>
  </li>
</template>
