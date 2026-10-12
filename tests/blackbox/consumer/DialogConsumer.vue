<script setup lang="ts">
import { ref } from "vue";
import { Dialog, DialogLayout, Button } from "@dicehub/kappa";
const layoutOpen = ref(false);
</script>

<template>
  <main>
    <h1>Dialog consumer</h1>
    <Dialog.Root>
      <Dialog.Trigger as-child><Button>Open dialog</Button></Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header><Dialog.Title>Original dialog</Dialog.Title></Dialog.Header>
        <template #close><Dialog.Close as-child><Button>Custom close</Button></Dialog.Close></template>
      </Dialog.Content>
    </Dialog.Root>
    <DialogLayout id="consumer-layout" v-model:open="layoutOpen">
      <DialogLayout.Trigger as-child><Button>Open layout</Button></DialogLayout.Trigger>
      <DialogLayout.Content>
        <DialogLayout.Header><DialogLayout.Title>Layout dialog</DialogLayout.Title></DialogLayout.Header>
        <DialogLayout.Body>Layout content</DialogLayout.Body>
      </DialogLayout.Content>
    </DialogLayout>
    <output aria-label="Layout open">{{ layoutOpen }}</output>
  </main>
</template>
