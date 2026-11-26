<script setup lang="ts">
import { ToolbarButton } from "@dicehub/kappa/components/button";
import { Pin } from "@lucide/vue";

defineProps<{ page: string; label: string; pinned: boolean }>();
const emit = defineEmits<{ toggle: [page: string] }>();
</script>

<template>
  <ToolbarButton size="sm" :icon="Pin" :icon-props="{ fill: pinned ? 'currentColor' : 'none' }"
    :tooltip="`${pinned ? 'Unpin' : 'Pin'} ${label}`" :aria-pressed="pinned"
    class="paneled-pin-action" @click="emit('toggle', page)" />
</template>

<style src="./paneled-workspace-pin-action.css"></style>
