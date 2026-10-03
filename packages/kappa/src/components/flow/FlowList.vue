<script setup lang="ts">
import type { FlowListSlots } from "./flow";

defineOptions({ inheritAttrs: false });

defineSlots<FlowListSlots>();
</script>

<template>
  <li
    v-bind="$attrs"
    class="kappa-flow-sequence"
    data-flow-item
    data-flow-type="list"
    data-slot="flow-list"
  >
    <ul
      class="kappa-flow__list kappa-flow__list--nested"
      data-flow-list
      data-slot="flow-list-items"
    >
      <slot />
    </ul>
  </li>
</template>
