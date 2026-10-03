<script setup lang="ts">
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";
import { Toolbar } from "@dicehub/kappa/components/toolbar";
import { ref } from "vue";

/**
 * Real controls for the standalone theme fixture route. The route imports only
 * `@dicehub/kappa/styles/theme-kappa.css`, so every color here has to resolve
 * from the published theme without documentation aliases.
 */
const pressed = ref(true);
const view = ref<string[]>(["board"]);
</script>

<template>
  <div class="theme-fixture-controls">
    <div class="theme-fixture-controls__row">
      <Button variant="primary">Save</Button>
      <Button variant="outline">Discard</Button>
      <Button variant="destructive">Delete</Button>
    </div>

    <label class="theme-fixture-controls__field">
      <span>Workspace</span>
      <Input model-value="Atlas geometry" readonly />
    </label>

    <Toolbar aria-label="Theme fixture tools">
      <Toolbar.Button data-fixture-pressed aria-pressed="true">Selected</Toolbar.Button>
      <Toolbar.Button
        data-fixture-toggle
        :aria-pressed="pressed"
        @click="pressed = !pressed"
      >
        Toggle
      </Toolbar.Button>
      <Toolbar.Button>Quiet</Toolbar.Button>
    </Toolbar>

    <ToggleGroup.Root v-model="view" aria-label="Theme fixture view" variant="outline">
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
    </ToggleGroup.Root>

    <div class="theme-fixture-controls__row">
      <Badge variant="info">Synced</Badge>
      <Badge variant="success">Ready</Badge>
      <Badge variant="warning">Queued</Badge>
      <Badge variant="error">Failed</Badge>
    </div>
  </div>
</template>

<style scoped>
.theme-fixture-controls {
  display: grid;
  justify-items: start;
  gap: 0.875rem;
  color: var(--kappa-default);
}

.theme-fixture-controls__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.theme-fixture-controls__field {
  display: grid;
  width: min(100%, 18rem);
  gap: 0.375rem;
  color: var(--kappa-subtle);
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
