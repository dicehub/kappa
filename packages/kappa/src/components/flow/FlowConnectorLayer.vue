<script setup lang="ts">
import type { FlowConnector } from "./flow";

defineProps<{
  connectors: FlowConnector[];
  markerId: string;
}>();
</script>

<template>
  <svg
    class="kappa-flow__connectors"
    width="100%"
    height="100%"
    overflow="visible"
    aria-hidden="true"
    data-slot="flow-connectors"
  >
    <defs>
      <marker
        :id="markerId"
        markerWidth="8"
        markerHeight="8"
        refX="0"
        refY="4"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path
          d="M 0,1.5 Q 0,0 1.5,0 Q 3.5,1 5.8,3.2 Q 6.5,4 5.8,4.8 Q 3.5,7 1.5,8 Q 0,8 0,6.5 Z"
          fill="currentColor"
          stroke="none"
        />
      </marker>
    </defs>
    <g
      v-for="(connector, index) in connectors"
      :key="`${connector.fromId ?? 'connector'}-${connector.toId ?? index}`"
      :class="{ 'kappa-flow__connector--disabled': connector.disabled }"
      :data-disabled="connector.disabled ? '' : undefined"
    >
      <path
        class="kappa-flow__connector-path"
        :d="connector.path"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        :marker-end="`url(#${markerId})`"
        :data-index="index"
        :data-testid="
          connector.fromId && connector.toId
            ? `${connector.fromId}-${connector.toId}`
            : undefined
        "
      />
    </g>
  </svg>
</template>
