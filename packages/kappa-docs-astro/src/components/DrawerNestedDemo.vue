<script setup lang="ts">
import { Button } from "@dicehub/kappa/components/button";
import { Drawer } from "@dicehub/kappa/components/drawer";
</script>

<template>
  <Drawer.Stack>
    <Drawer.Root>
      <Drawer.Trigger as-child><Button variant="outline">Open settings</Button></Drawer.Trigger>
      <Drawer.Content data-drawer-demo-surface="nested">
        <Drawer.Header>
          <Drawer.Title>Settings</Drawer.Title>
          <Drawer.Description>Review your preferences before opening advanced settings.</Drawer.Description>
        </Drawer.Header>
        <dl class="drawer-nested__metrics">
          <div><dt>Theme</dt><dd>System</dd></div>
          <div><dt>Email digest</dt><dd>Weekly</dd></div>
        </dl>
        <Drawer.Root>
          <Drawer.Trigger as-child><Button variant="outline">Advanced settings</Button></Drawer.Trigger>
          <Drawer.Content data-drawer-demo-surface="nested-child">
            <Drawer.Header>
              <Drawer.Title>Advanced settings</Drawer.Title>
              <Drawer.Description>Manage sign-in sessions and connected applications.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer>
              <Drawer.Close as-child><Button variant="primary">Done</Button></Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
        <Drawer.Footer>
          <Drawer.Close as-child><Button variant="secondary">Close</Button></Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  </Drawer.Stack>
</template>

<style scoped>
.drawer-nested__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 0;
}

.drawer-nested__metrics div {
  display: grid;
  gap: 0.125rem;
  padding: 0.75rem;
  border: 1px solid var(--docs-border);
  border-radius: 0.5rem;
  background: var(--docs-tint);
}

.drawer-nested__metrics dt {
  color: var(--docs-subtle);
  font-size: 0.6875rem;
}

.drawer-nested__metrics dd {
  margin: 0;
  color: var(--docs-default);
  font-family: var(--docs-font-mono);
  font-size: 0.8125rem;
  font-weight: 650;
}
</style>
