<script setup lang="ts">
import { useDirection } from "@dicehub/kappa/components/direction-provider";

const direction = useDirection();
</script>

<template>
  <output class="direction-value" data-direction-value aria-live="polite">
    Current direction: <strong>{{ direction.toUpperCase() }}</strong>
  </output>
</template>
