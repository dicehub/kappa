<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { CollapsibleSection } from "@dicehub/kappa/components/collapsible-section";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
import NumberInputField from "./NumberInputField.vue";

type DemoVariant = "preview" | "basic" | "compact" | "actions" | "controlled" | "disabled";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const actionsOpen = ref(true);
const controlledOpen = ref(false);
const featureDistance = ref("0.15 m");
const refinementLevel = ref("4");
const refinementLevelCompact = ref(4);
const bufferCells = ref(3);
const featureAngle = ref(30);
const resetCount = ref(0);

const resetSurfaceRefinement = () => {
  refinementLevel.value = "4";
  featureDistance.value = "0.15 m";
};

const resetBoundaries = () => {
  resetCount.value += 1;
};
</script>

<template>
  <div class="collapsible-section-demo" :data-collapsible-section-demo="props.variant">
    <CollapsibleSection.Root v-if="props.variant === 'preview'" default-open>
      <CollapsibleSection.Header>
        <CollapsibleSection.Trigger>Surface refinement</CollapsibleSection.Trigger>
        <CollapsibleSection.Actions>
          <Button size="xs" variant="ghost" type="button" @click="resetSurfaceRefinement">
            Reset
          </Button>
        </CollapsibleSection.Actions>
      </CollapsibleSection.Header>
      <CollapsibleSection.Content>
        <form class="collapsible-section-demo__form" @submit.prevent>
          <div class="collapsible-section-demo__field">
            <Label html-for="section-level">Refinement level</Label>
            <Input id="section-level" v-model="refinementLevel" size="sm" />
          </div>
          <div class="collapsible-section-demo__field">
            <Label html-for="section-distance">Feature distance</Label>
            <Input id="section-distance" v-model="featureDistance" size="sm" />
          </div>
        </form>
      </CollapsibleSection.Content>
    </CollapsibleSection.Root>

    <CollapsibleSection.Root v-else-if="props.variant === 'basic'" default-open>
      <CollapsibleSection.Header>
        <CollapsibleSection.Trigger>Solver controls</CollapsibleSection.Trigger>
      </CollapsibleSection.Header>
      <CollapsibleSection.Content>
        <p>Pressure correction uses two non-orthogonal passes.</p>
      </CollapsibleSection.Content>
    </CollapsibleSection.Root>

    <CollapsibleSection.Root
      v-else-if="props.variant === 'compact'"
      class="collapsible-section-demo__compact"
      default-open
      size="compact"
    >
      <CollapsibleSection.Header>
        <CollapsibleSection.Trigger>Surface refinement</CollapsibleSection.Trigger>
      </CollapsibleSection.Header>
      <CollapsibleSection.Content>
        <div class="kappa-compact-number-demo collapsible-section-demo__compact-form">
          <NumberInputField
            label="Level"
            :value="refinementLevelCompact"
            @change="refinementLevelCompact = $event"
          />
          <NumberInputField
            label="Buffer cells"
            :value="bufferCells"
            @change="bufferCells = $event"
          />
          <NumberInputField
            label="Angle"
            :value="featureAngle"
            @change="featureAngle = $event"
          />
        </div>
      </CollapsibleSection.Content>
    </CollapsibleSection.Root>

    <div v-else-if="props.variant === 'actions'" class="collapsible-section-demo__stack">
      <CollapsibleSection.Root v-model:open="actionsOpen">
        <CollapsibleSection.Header>
          <CollapsibleSection.Trigger>Boundary conditions</CollapsibleSection.Trigger>
          <CollapsibleSection.Actions>
            <Button
              size="xs"
              variant="ghost"
              type="button"
              @click="resetBoundaries"
            >
              Reset
            </Button>
          </CollapsibleSection.Actions>
        </CollapsibleSection.Header>
        <CollapsibleSection.Content>
          <p>Seven patches are configured. All required fields are valid.</p>
        </CollapsibleSection.Content>
      </CollapsibleSection.Root>
      <output aria-live="polite">
        {{ actionsOpen ? "Section open" : "Section closed" }} · Resets {{ resetCount }}
      </output>
    </div>

    <div v-else-if="props.variant === 'controlled'" class="collapsible-section-demo__stack">
      <Button size="sm" variant="outline" type="button" @click="controlledOpen = !controlledOpen">
        {{ controlledOpen ? "Close diagnostics" : "Open diagnostics" }}
      </Button>
      <CollapsibleSection.Root v-model:open="controlledOpen">
        <CollapsibleSection.Header>
          <CollapsibleSection.Trigger>Run diagnostics</CollapsibleSection.Trigger>
        </CollapsibleSection.Header>
        <CollapsibleSection.Content>
          <p>Residual 8.4e-6 · Courant max 0.82 · 1,240 iterations</p>
        </CollapsibleSection.Content>
      </CollapsibleSection.Root>
    </div>

    <CollapsibleSection.Root v-else default-open disabled>
      <CollapsibleSection.Header>
        <CollapsibleSection.Trigger>Generated controls</CollapsibleSection.Trigger>
      </CollapsibleSection.Header>
      <CollapsibleSection.Content>
        <p>The section stays open while its disclosure trigger is disabled.</p>
      </CollapsibleSection.Content>
    </CollapsibleSection.Root>
  </div>
</template>

<style>
@import "./number-input-compact-demo.css";

.collapsible-section-demo {
  display: grid;
  inline-size: min(100%, 36rem);
  min-inline-size: 0;
  align-self: flex-start;
  color: var(--kappa-default);
  font-family: var(--kappa-font-sans);
}

.collapsible-section-demo__form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.collapsible-section-demo__field,
.collapsible-section-demo__stack {
  display: grid;
  min-inline-size: 0;
  gap: 0.5rem;
}

.collapsible-section-demo__compact {
  inline-size: min(100%, 17rem);
}

.collapsible-section-demo[data-collapsible-section-demo="compact"] {
  justify-items: center;
}

.collapsible-section-demo__compact-form {
  display: grid;
  gap: 0.125rem;
  inline-size: 100%;
}

.collapsible-section-demo__stack > .kappa-button {
  inline-size: fit-content;
}

.collapsible-section-demo p,
.collapsible-section-demo output {
  margin: 0;
}

.collapsible-section-demo output {
  color: var(--kappa-subtle);
  font-family: var(--kappa-font-mono);
  font-size: 0.75rem;
}

@media (max-width: 34rem) {
  .collapsible-section-demo__form {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
