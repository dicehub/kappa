export const barrelCode = `import {
  CollapsibleSection,
  CollapsibleSectionActions,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionIndicator,
  CollapsibleSectionRoot,
  CollapsibleSectionTrigger,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  CollapsibleSection,
  CollapsibleSectionActions,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionIndicator,
  CollapsibleSectionRoot,
  CollapsibleSectionTrigger,
} from "@dicehub/kappa/components/collapsible-section";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { CollapsibleSection } from "@dicehub/kappa/components/collapsible-section";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";

const refinementLevel = ref("4");

const reset = () => {
  refinementLevel.value = "4";
};
</script>

<template>
  <CollapsibleSection.Root default-open>
    <CollapsibleSection.Header>
      <CollapsibleSection.Trigger>Surface refinement</CollapsibleSection.Trigger>
      <CollapsibleSection.Actions>
        <Button size="xs" variant="ghost" @click="reset">Reset</Button>
      </CollapsibleSection.Actions>
    </CollapsibleSection.Header>
    <CollapsibleSection.Content>
      <Label html-for="level">Refinement level</Label>
      <Input id="level" v-model="refinementLevel" size="sm" />
    </CollapsibleSection.Content>
  </CollapsibleSection.Root>
</template>`;

export const usageCode = `<script setup>
import { CollapsibleSection } from "@dicehub/kappa/components/collapsible-section";
</script>

<template>
  <CollapsibleSection.Root default-open>
    <CollapsibleSection.Header>
      <CollapsibleSection.Trigger>Solver controls</CollapsibleSection.Trigger>
    </CollapsibleSection.Header>
    <CollapsibleSection.Content>
      Pressure correction uses two non-orthogonal passes.
    </CollapsibleSection.Content>
  </CollapsibleSection.Root>
</template>`;

const actionsCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { CollapsibleSection } from "@dicehub/kappa/components/collapsible-section";

const open = ref(true);
const resets = ref(0);

const resetBoundaries = () => {
  resets.value += 1;
};
</script>

<template>
  <CollapsibleSection.Root v-model:open="open">
    <CollapsibleSection.Header>
      <CollapsibleSection.Trigger>Boundary conditions</CollapsibleSection.Trigger>
      <CollapsibleSection.Actions>
        <Button size="xs" variant="ghost" @click="resetBoundaries">Reset</Button>
      </CollapsibleSection.Actions>
    </CollapsibleSection.Header>
    <CollapsibleSection.Content>
      Seven patches are configured.
    </CollapsibleSection.Content>
  </CollapsibleSection.Root>
</template>`;

const compactCode = `<script setup>
import { ref } from "vue";
import { CollapsibleSection } from "@dicehub/kappa/components/collapsible-section";
import NumberInputField from "./NumberInputField.vue";

const level = ref(4);
const bufferCells = ref(3);
const featureAngle = ref(30);
</script>

<template>
  <CollapsibleSection.Root default-open size="compact">
    <CollapsibleSection.Header>
      <CollapsibleSection.Trigger>Surface refinement</CollapsibleSection.Trigger>
    </CollapsibleSection.Header>
    <CollapsibleSection.Content>
      <div class="compact-fields">
        <NumberInputField label="Level" :value="level" @change="level = $event" />
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
</template>

<style scoped>
.compact-fields {
  display: grid;
  gap: 0.125rem;
}
</style>`;

const controlledCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { CollapsibleSection } from "@dicehub/kappa/components/collapsible-section";

const open = ref(false);
</script>

<template>
  <Button size="sm" variant="outline" @click="open = !open">
    {{ open ? "Close diagnostics" : "Open diagnostics" }}
  </Button>
  <CollapsibleSection.Root v-model:open="open">
    <CollapsibleSection.Header>
      <CollapsibleSection.Trigger>Run diagnostics</CollapsibleSection.Trigger>
    </CollapsibleSection.Header>
    <CollapsibleSection.Content>
      Residual 8.4e-6 · Courant max 0.82
    </CollapsibleSection.Content>
  </CollapsibleSection.Root>
</template>`;

const disabledCode = `<CollapsibleSection.Root default-open disabled>
  <CollapsibleSection.Header>
    <CollapsibleSection.Trigger>Generated controls</CollapsibleSection.Trigger>
  </CollapsibleSection.Header>
  <CollapsibleSection.Content>
    The section stays open while its disclosure trigger is disabled.
  </CollapsibleSection.Content>
</CollapsibleSection.Root>`;

export const examples = [
  {
    id: "compact",
    title: "Compact",
    description: "Combine the compact section with the 20px Number Input composition for dense technical panels.",
    variant: "compact",
    code: compactCode,
  },
  {
    id: "header-actions",
    title: "Header Actions",
    description: "Place compact actions beside the trigger. Clicking an action does not change the open state.",
    variant: "actions",
    code: actionsCode,
  },
  {
    id: "controlled",
    title: "Controlled",
    description: "Use v-model:open when another control or application state also changes the section.",
    variant: "controlled",
    code: controlledCode,
  },
  {
    id: "disabled",
    title: "Disabled Trigger",
    description: "Disable disclosure changes while keeping already-open content visible.",
    variant: "disabled",
    code: disabledCode,
  },
] as const;

export const rootProps = [
  { name: "open", type: "boolean", defaultValue: "-", description: "Controlled open state; supports v-model:open." },
  { name: "size", type: '"compact" | "base"', defaultValue: '"base"', description: "Controls header and content density." },
  { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state for uncontrolled use." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents the trigger from changing the open state." },
  { name: "lazyMount", type: "boolean", defaultValue: "false", description: "Defers content mounting until it first opens." },
  { name: "unmountOnExit", type: "boolean", defaultValue: "false", description: "Removes content after the close transition." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the disclosure state machine." },
  { name: "ids", type: "CollapsibleSectionRootProps['ids']", defaultValue: "generated", description: "Overrides generated root, trigger, and content IDs." },
] as const;

export const parts = [
  { name: "CollapsibleSection.Header", element: "div", description: "Groups the disclosure trigger and optional independent actions." },
  { name: "CollapsibleSection.Trigger", element: "button", description: "Toggles content and supplies the default leading indicator." },
  { name: "CollapsibleSection.Indicator", element: "div", description: "Shows open state with a replaceable decorative icon." },
  { name: "CollapsibleSection.Actions", element: "div", description: "Holds compact controls that do not toggle the section." },
  { name: "CollapsibleSection.Content", element: "div", description: "Animated content region with dense default padding." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Emitted when the controlled open state changes." },
  { name: "openChange", payload: "{ open: boolean }", description: "Emitted after an open-state change." },
  { name: "exitComplete", payload: "void", description: "Emitted after the close transition completes." },
] as const;

export const dataSlots = [
  ["collapsible-section", "Root disclosure element."],
  ["collapsible-section-header", "Header row."],
  ["collapsible-section-trigger", "Disclosure button."],
  ["collapsible-section-label", "Clipped trigger label."],
  ["collapsible-section-indicator", "Open-state marker."],
  ["collapsible-section-actions", "Independent header actions."],
  ["collapsible-section-content", "Animated content region."],
  ["collapsible-section-content-body", "Default padded content body."],
] as const;

export const exportsList = [
  { name: "CollapsibleSection", description: "Compound API exposing Root, Header, Trigger, Indicator, Actions, and Content." },
  { name: "CollapsibleSectionRoot", description: "Unaugmented root component." },
  { name: "CollapsibleSectionHeader", description: "Header layout component." },
  { name: "CollapsibleSectionTrigger", description: "Accessible disclosure trigger." },
  { name: "CollapsibleSectionIndicator", description: "Decorative open-state indicator." },
  { name: "CollapsibleSectionActions", description: "Independent header action container." },
  { name: "CollapsibleSectionContent", description: "Animated section content." },
  { name: "CollapsibleSectionProps", description: "Public root prop contract." },
  { name: "CollapsibleSectionEmits", description: "Public root event contract." },
] as const;
