<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Dialog } from "@dicehub/kappa/components/dialog";
import { Drawer } from "@dicehub/kappa/components/drawer";

const isCompact = ref(false);
let mediaQuery: MediaQueryList | undefined;

const updateLayout = (event?: MediaQueryListEvent) => {
  isCompact.value = event?.matches ?? mediaQuery?.matches ?? false;
};

onMounted(() => {
  mediaQuery = window.matchMedia("(max-width: 47.99rem)");
  updateLayout();
  mediaQuery.addEventListener("change", updateLayout);
});

onBeforeUnmount(() => mediaQuery?.removeEventListener("change", updateLayout));
</script>

<template>
  <Drawer.Root v-if="isCompact">
    <Drawer.Trigger as-child><Button variant="outline">Edit profile</Button></Drawer.Trigger>
    <Drawer.Content data-drawer-demo-surface="responsive-drawer">
      <Drawer.Header>
        <Drawer.Title>Edit profile</Drawer.Title>
        <Drawer.Description>Compact view uses the bottom Drawer.</Drawer.Description>
      </Drawer.Header>
      <label class="drawer-responsive__field">Display name <input value="Alex Morgan" /></label>
      <Drawer.Footer>
        <Drawer.Close as-child><Button variant="secondary">Cancel</Button></Drawer.Close>
        <Drawer.Close as-child><Button variant="primary">Save</Button></Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>

  <Dialog.Root v-else>
    <Dialog.Trigger as-child><Button variant="outline">Edit profile</Button></Dialog.Trigger>
    <Dialog.Content data-drawer-demo-surface="responsive-dialog">
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>Wide view uses the centered Dialog.</Dialog.Description>
      </Dialog.Header>
      <label class="drawer-responsive__field">Display name <input value="Alex Morgan" /></label>
      <Dialog.Footer>
        <Dialog.Close as-child><Button variant="secondary">Cancel</Button></Dialog.Close>
        <Dialog.Close as-child><Button variant="primary">Save</Button></Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</template>

<style scoped>
.drawer-responsive__field {
  display: grid;
  gap: 0.375rem;
  color: var(--docs-default);
  font-size: 0.75rem;
  font-weight: 600;
}

.drawer-responsive__field input {
  min-block-size: 2rem;
  inline-size: 100%;
  padding-inline: 0.625rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.4375rem;
  background: var(--docs-control);
  color: var(--docs-default);
  font: inherit;
  font-size: 0.8125rem;
}

.drawer-responsive__field input:focus-visible {
  border-color: var(--docs-brand);
  outline: 2px solid var(--docs-brand-soft);
  outline-offset: 1px;
}
</style>
