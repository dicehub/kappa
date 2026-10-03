<script setup lang="ts">
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";

const modes = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
] as const;
</script>

<template>
  <div class="colors-preview" data-colors-preview>
    <section
      v-for="mode in modes"
      :key="mode.id"
      class="colors-preview__panel"
      :data-kappa-theme="mode.id"
      :data-colors-preview-mode="mode.id"
    >
      <header class="colors-preview__header">
        <span class="colors-preview__label">{{ mode.label }}</span>
        <code class="colors-preview__attribute">data-kappa-theme="{{ mode.id }}"</code>
      </header>

      <div class="colors-preview__body">
        <label class="colors-preview__field">
          <span class="colors-preview__field-label">Workspace</span>
          <Input model-value="Atlas geometry" readonly />
        </label>

        <div class="colors-preview__row">
          <Button variant="primary">Save changes</Button>
          <Button variant="outline">Discard</Button>
        </div>

        <div class="colors-preview__row">
          <Badge variant="info">Synced</Badge>
          <Badge variant="success">Ready</Badge>
          <Badge variant="warning">Queued</Badge>
          <Badge variant="error">Failed</Badge>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.colors-preview {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.colors-preview__panel {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--kappa-line);
  border-radius: 0.75rem;
  background: var(--kappa-canvas);
  color: var(--kappa-default);
}

.colors-preview__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.875rem;
}

.colors-preview__label {
  color: var(--kappa-strong);
  font-size: 0.8125rem;
  font-weight: 600;
}

.colors-preview__attribute {
  color: var(--kappa-subtle);
  font-size: 0.6875rem;
}

.colors-preview__body {
  display: grid;
  gap: 0.75rem;
}

.colors-preview__field {
  display: grid;
  gap: 0.375rem;
  color: var(--kappa-subtle);
  font-size: 0.75rem;
  font-weight: 500;
}

.colors-preview__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 40rem) {
  .colors-preview {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
