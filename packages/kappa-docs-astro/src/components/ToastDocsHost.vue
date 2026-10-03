<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Button } from "@dicehub/kappa/components/button";
import { Toast, Toaster } from "@dicehub/kappa/components/toast";
import { clearToastDemos, toastDemoState as state } from "./toast-demo-state";
onBeforeUnmount(clearToastDemos);
</script>

<template>
  <DirectionProvider v-if="state" :key="state.key" :locale="state.locale">
    <Toaster v-if="!state.custom" :toaster="state.toaster" data-toast-docs-host="default" />
    <Toaster v-else v-slot="toast" :toaster="state.toaster" data-toast-docs-host="custom">
      <Toast.Root>
        <div class="toast-demo-custom">
          <Toast.Indicator />
          <div class="toast-demo-custom__copy">
            <Toast.Title>{{ toast.title }}</Toast.Title>
            <Toast.Description>{{ toast.description }}</Toast.Description>
            <Toast.ActionTrigger as-child><Button size="xs" variant="outline">{{ toast.action?.label }}</Button></Toast.ActionTrigger>
          </div>
          <Toast.CloseTrigger aria-label="Close custom notification" />
        </div>
      </Toast.Root>
    </Toaster>
  </DirectionProvider>
</template>

<style scoped>
.toast-demo-custom { display: flex; align-items: start; gap: 0.625rem; }
.toast-demo-custom__copy { display: grid; flex: 1; min-width: 0; gap: 0.375rem; }
.toast-demo-custom__copy :deep(button) { justify-self: start; }
</style>
