<script setup lang="ts">
import { computed, useId } from "vue";
import type { FlowNodeProps, FlowNodeSlots } from "./flow";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FlowNodeProps>(), {
  disabled: false,
  unstyled: false,
});

defineSlots<FlowNodeSlots>();

const generatedId = `kappa-flow-node-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
const nodeId = computed(() => props.id ?? generatedId);
</script>

<template>
  <li
    v-bind="$attrs"
    :id="props.id"
    class="kappa-flow-node"
    :class="{
      'kappa-flow-node--disabled': props.disabled,
      'kappa-flow-node--unstyled': props.unstyled,
    }"
    :aria-disabled="props.disabled ? 'true' : undefined"
    data-flow-item
    data-flow-type="node"
    data-slot="flow-node"
    :data-flow-disabled="props.disabled ? 'true' : undefined"
    :data-flow-id="nodeId"
    :data-node-id="nodeId"
  >
    <slot />
  </li>
</template>
