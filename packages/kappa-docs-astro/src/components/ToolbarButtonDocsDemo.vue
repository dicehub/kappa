<script setup>
import { Download, Layers, Plus, RotateCcw } from "@lucide/vue";
import { ref } from "vue";
import { ToolbarButton } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";

const message = ref("3 result layers · Last saved just now");
</script>

<template>
  <div class="toolbar-button-demo" data-button-demo="toolbar">
    <header class="toolbar-button-demo__header">
      <strong>Results</strong>
      <div class="toolbar-button-demo__actions" role="group" aria-label="Result actions">
        <Dropdown.Root aria-label="Create item" @select="message = $event.value">
          <Dropdown.Trigger as-child>
            <ToolbarButton :icon="Plus" tooltip="Create new…" aria-label="Create item" variant="outline" size="sm" />
          </Dropdown.Trigger>
          <Dropdown.Content show-arrow>
            <Dropdown.Group>
              <Dropdown.Label>Rotor study</Dropdown.Label>
              <Dropdown.Item value="New case selected">New case</Dropdown.Item>
              <Dropdown.Item value="New report selected">New report</Dropdown.Item>
            </Dropdown.Group>
            <Dropdown.Separator />
            <Dropdown.Group>
              <Dropdown.Label>Workspace</Dropdown.Label>
              <Dropdown.Item value="New project selected">New project</Dropdown.Item>
              <Dropdown.Item value="Import geometry selected">Import geometry</Dropdown.Item>
            </Dropdown.Group>
          </Dropdown.Content>
        </Dropdown.Root>
        <ToolbarButton
          :icon="RotateCcw" tooltip="Reset view" data-trace="reset-view"
          @click="message = 'View reset'"
        />
        <ToolbarButton
          :icon="Layers" tooltip="Result layers" aria-label="View 3 result layers"
          @click="message = '3 result layers shown'"
        >3</ToolbarButton>
        <ToolbarButton
          :icon="Download" tooltip="Export results" aria-label="Export results"
          @click="message = 'Results export selected'"
        >Export</ToolbarButton>
      </div>
    </header>
    <output class="toolbar-button-demo__status" role="status" aria-live="polite">{{ message }}</output>
  </div>
</template>

<style scoped>
.toolbar-button-demo { display: grid; inline-size: 100%; min-inline-size: 0; gap: 0.75rem; }
.toolbar-button-demo__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--kappa-line);
  border-radius: 0.625rem;
  background: var(--kappa-tint);
}
.toolbar-button-demo__header strong { color: var(--kappa-default); font-size: 0.875rem; }
.toolbar-button-demo__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin-inline-start: auto;
}
.toolbar-button-demo__status { color: var(--kappa-subtle); font-size: 0.75rem; line-height: 1.5; }
</style>
