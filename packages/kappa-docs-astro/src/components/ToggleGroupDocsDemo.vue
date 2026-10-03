<script setup lang="ts">
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";
import { ref } from "vue";

type DemoVariant =
  | "preview"
  | "usage"
  | "multiple"
  | "vertical"
  | "sizes"
  | "states"
  | "controlled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const previewView = ref(["board"]);
const visibleColumns = ref(["status", "owner"]);
const controlledView = ref(["board"]);
</script>

<template>
  <div class="toggle-group-demo" :data-toggle-group-demo="props.variant">
    <section v-if="props.variant === 'preview'" class="toggle-group-demo__stack">
      <div class="toggle-group-demo__heading">
        <span class="toggle-group-demo__eyebrow">Workspace view</span>
        <span class="toggle-group-demo__hint">One selection</span>
      </div>
      <ToggleGroup.Root
        v-model="previewView"
        aria-label="Workspace view"
        spacing="none"
        variant="outline"
      >
        <ToggleGroup.Item value="list">List</ToggleGroup.Item>
        <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
        <ToggleGroup.Item value="timeline">Timeline</ToggleGroup.Item>
      </ToggleGroup.Root>
      <output role="status">Showing {{ previewView[0] }} view</output>
    </section>

    <ToggleGroup.Root
      v-else-if="props.variant === 'usage'"
      :default-value="['board']"
      aria-label="Workspace view"
      variant="outline"
    >
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
      <ToggleGroup.Item value="timeline">Timeline</ToggleGroup.Item>
    </ToggleGroup.Root>

    <section v-else-if="props.variant === 'multiple'" class="toggle-group-demo__stack">
      <ToggleGroup.Root
        v-model="visibleColumns"
        multiple
        aria-label="Visible columns"
        variant="outline"
      >
        <ToggleGroup.Item value="status">Status</ToggleGroup.Item>
        <ToggleGroup.Item value="owner">Owner</ToggleGroup.Item>
        <ToggleGroup.Item value="updated">Updated</ToggleGroup.Item>
      </ToggleGroup.Root>
      <output role="status">Columns: {{ visibleColumns.join(", ") }}</output>
    </section>

    <ToggleGroup.Root
      v-else-if="props.variant === 'vertical'"
      :default-value="['board']"
      aria-label="Workspace view"
      orientation="vertical"
      variant="outline"
    >
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
      <ToggleGroup.Item value="timeline">Timeline</ToggleGroup.Item>
    </ToggleGroup.Root>

    <div v-else-if="props.variant === 'sizes'" class="toggle-group-demo__sizes">
      <ToggleGroup.Root :default-value="['small']" aria-label="Small density" size="sm">
        <ToggleGroup.Item value="small">Small</ToggleGroup.Item>
        <ToggleGroup.Item value="base">Base</ToggleGroup.Item>
        <ToggleGroup.Item value="large">Large</ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root :default-value="['base']" aria-label="Base density" size="base">
        <ToggleGroup.Item value="small">Small</ToggleGroup.Item>
        <ToggleGroup.Item value="base">Base</ToggleGroup.Item>
        <ToggleGroup.Item value="large">Large</ToggleGroup.Item>
      </ToggleGroup.Root>
      <ToggleGroup.Root :default-value="['large']" aria-label="Large density" size="lg">
        <ToggleGroup.Item value="small">Small</ToggleGroup.Item>
        <ToggleGroup.Item value="base">Base</ToggleGroup.Item>
        <ToggleGroup.Item value="large">Large</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>

    <div v-else-if="props.variant === 'states'" class="toggle-group-demo__states">
      <div class="toggle-group-demo__state">
        <span class="toggle-group-demo__eyebrow">Item disabled</span>
        <ToggleGroup.Root
          :default-value="['available']"
          aria-label="Availability"
          variant="outline"
        >
          <ToggleGroup.Item value="available">Available</ToggleGroup.Item>
          <ToggleGroup.Item value="pending" disabled>Pending</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <div class="toggle-group-demo__state">
        <span class="toggle-group-demo__eyebrow">Group disabled</span>
        <ToggleGroup.Root
          :default-value="['locked']"
          aria-label="Locked choice"
          disabled
          variant="outline"
        >
          <ToggleGroup.Item value="locked">Locked</ToggleGroup.Item>
          <ToggleGroup.Item value="archived">Archived</ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </div>

    <section v-else class="toggle-group-demo__stack">
      <ToggleGroup.Root v-model="controlledView" aria-label="Workspace view">
        <ToggleGroup.Item value="list">List</ToggleGroup.Item>
        <ToggleGroup.Item value="board">Board</ToggleGroup.Item>
      </ToggleGroup.Root>
      <output role="status">Selected: {{ controlledView.join(", ") }}</output>
    </section>
  </div>
</template>

<style scoped>
.toggle-group-demo {
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 10rem;
  place-items: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.toggle-group-demo__stack,
.toggle-group-demo__state {
  display: grid;
  min-inline-size: 0;
  gap: 0.625rem;
}

.toggle-group-demo__stack {
  inline-size: min(100%, 28rem);
}

.toggle-group-demo__heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.toggle-group-demo__eyebrow {
  color: var(--kappa-default, #17191f);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.02em;
}

.toggle-group-demo__hint,
.toggle-group-demo output {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
}

.toggle-group-demo output {
  margin: 0;
}

.toggle-group-demo__sizes {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
}

.toggle-group-demo__states {
  display: grid;
  inline-size: min(100%, 34rem);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 36rem) {
  .toggle-group-demo__states {
    grid-template-columns: 1fr;
  }
}
</style>
