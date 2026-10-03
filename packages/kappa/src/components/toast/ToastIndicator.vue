<script setup lang="ts">
import { useToastContext } from "@ark-ui/vue/toast";
import Loader from "../loader/Loader.vue";
import type { ToastIndicatorSlots } from "./toast";
defineOptions({ inheritAttrs: false });
defineSlots<ToastIndicatorSlots>();
const toast = useToastContext();
</script>

<template>
  <span v-bind="$attrs" class="kappa-toast__indicator" data-slot="toast-indicator" aria-hidden="true">
    <slot v-bind="toast">
      <Loader v-if="toast.type === 'loading'" :size="16" decorative />
      <svg v-else viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <template v-if="toast.type === 'success'"><circle cx="10" cy="10" r="7.5" /><path d="m6.5 10 2.25 2.25 4.75-4.75" /></template>
        <template v-else-if="toast.type === 'error'"><circle cx="10" cy="10" r="7.5" /><path d="m7.5 7.5 5 5m0-5-5 5" /></template>
        <template v-else-if="toast.type === 'warning'"><path d="M8.7 3.25a1.5 1.5 0 0 1 2.6 0l6.65 11.5A1.5 1.5 0 0 1 16.65 17H3.35a1.5 1.5 0 0 1-1.3-2.25L8.7 3.25ZM10 7v4m0 3h.01" /></template>
        <template v-else><circle cx="10" cy="10" r="7.5" /><path d="M10 9v5m0-8h.01" /></template>
      </svg>
    </slot>
  </span>
</template>

<style src="./toast.css"></style>
