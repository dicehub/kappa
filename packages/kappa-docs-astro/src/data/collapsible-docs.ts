export const barrelCode = `import {
  Collapsible,
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleIndicator,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Collapsible,
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleIndicator,
} from "@dicehub/kappa/components/collapsible";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Collapsible } from "@dicehub/kappa/components/collapsible";

const open = ref(true);
</script>

<template>
  <Collapsible.Root v-model:open="open">
    <Collapsible.Trigger>Solver diagnostics</Collapsible.Trigger>
    <Collapsible.Content>
      Iterations: 1,240 · Residual: 8.4e-6 · Courant max: 0.82
    </Collapsible.Content>
  </Collapsible.Root>
</template>`;

export const usageCode = `<script setup>
import { Collapsible } from "@dicehub/kappa/components/collapsible";
</script>

<template>
  <Collapsible.Root>
    <Collapsible.Trigger>What is Kappa?</Collapsible.Trigger>
    <Collapsible.Content>
      Kappa is dicehub's Vue component library.
    </Collapsible.Content>
  </Collapsible.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleIndicator,
} from "@dicehub/kappa/components/collapsible";
</script>

<template>
  <CollapsibleRoot>
    <CollapsibleTrigger>
      Run details
      <template #indicator><CollapsibleIndicator /></template>
    </CollapsibleTrigger>
    <CollapsibleContent>24 partitions · 38 minute runtime</CollapsibleContent>
  </CollapsibleRoot>
</template>`;

export const basicCode = `<Collapsible.Root>
  <Collapsible.Trigger>What is Kappa?</Collapsible.Trigger>
  <Collapsible.Content>
    Kappa is dicehub's Vue component library.
  </Collapsible.Content>
</Collapsible.Root>`;

export const multipleCode = `<div class="collapsible-list">
  <Collapsible.Root>
    <Collapsible.Trigger>What is Kappa?</Collapsible.Trigger>
    <Collapsible.Content>
      Kappa is dicehub's Vue component library.
    </Collapsible.Content>
  </Collapsible.Root>
  <Collapsible.Root>
    <Collapsible.Trigger>How do I use it?</Collapsible.Trigger>
    <Collapsible.Content>
      Install the package and import the components that your project needs.
    </Collapsible.Content>
  </Collapsible.Root>
  <Collapsible.Root>
    <Collapsible.Trigger>Is it accessible?</Collapsible.Trigger>
    <Collapsible.Content>
      Yes. Ark UI supplies keyboard and screen reader behavior.
    </Collapsible.Content>
  </Collapsible.Root>
</div>

<style scoped>
.collapsible-list {
  display: grid;
  gap: 0.5rem;
}
</style>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Collapsible } from "@dicehub/kappa/components/collapsible";

const open = ref(false);
</script>

<template>
  <Collapsible.Root v-model:open="open">
    <Collapsible.Trigger>Boundary summary</Collapsible.Trigger>
    <Collapsible.Content>Seven boundary patches cover every mesh face.</Collapsible.Content>
  </Collapsible.Root>
  <output>Panel state: {{ open ? "open" : "closed" }}</output>
</template>`;

export const customTriggerCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Collapsible } from "@dicehub/kappa/components/collapsible";

const open = ref(false);
</script>

<template>
  <Collapsible.Root v-model:open="open">
    <Collapsible.Trigger as-child>
      <Button variant="outline" size="sm">
        {{ open ? "Hide details" : "Show details" }}
      </Button>
    </Collapsible.Trigger>
    <Collapsible.Content>
      The Kappa Button keeps its styling while Collapsible supplies disclosure behavior.
    </Collapsible.Content>
  </Collapsible.Root>
</template>`;

export const partialCode = `<Collapsible.Root :collapsed-height="44">
  <Collapsible.Trigger>Solver log</Collapsible.Trigger>
  <Collapsible.Content>
    <p>Time = 2.35</p>
    <p>smoothSolver: Initial residual = 2.1e-05</p>
    <p>GAMG: Initial residual = 8.4e-06</p>
  </Collapsible.Content>
</Collapsible.Root>`;

export const lazyCode = `<Collapsible.Root lazy-mount unmount-on-exit>
  <Collapsible.Trigger>Residual plot</Collapsible.Trigger>
  <Collapsible.Content>
    <ExpensiveResidualPlot />
  </Collapsible.Content>
</Collapsible.Root>`;

export const disabledCode = `<Collapsible.Root disabled>
  <Collapsible.Trigger>Transient controls</Collapsible.Trigger>
  <Collapsible.Content>
    Controls become available after initialization.
  </Collapsible.Content>
</Collapsible.Root>`;

export const rtlCode = `<Collapsible.Root dir="rtl" default-open>
  <Collapsible.Trigger>نتائج المحاكاة</Collapsible.Trigger>
  <Collapsible.Content>
    اكتملت المحاكاة والنتائج جاهزة للمراجعة.
  </Collapsible.Content>
</Collapsible.Root>`;

export const rootProps = [
  { name: "open", type: "boolean", defaultValue: "-", description: "Controlled open state; supports v-model:open." },
  { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Initial open state for uncontrolled use." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents the trigger from changing state." },
  { name: "collapsedHeight", type: "number | string", defaultValue: "-", description: "Content height that remains visible while closed." },
  { name: "collapsedWidth", type: "number | string", defaultValue: "-", description: "Content width that remains visible while closed." },
  { name: "lazyMount", type: "boolean", defaultValue: "false", description: "Defers content mounting until the first open state." },
  { name: "unmountOnExit", type: "boolean", defaultValue: "false", description: "Removes content after the close transition." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the state machine." },
  { name: "ids", type: "CollapsibleRootProps['ids']", defaultValue: "generated", description: "Overrides generated root, trigger, and content IDs." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into one child element." },
] as const;

export const partProps = [
  { name: "Collapsible.Trigger", element: "button", description: "Toggles content and manages aria-expanded and aria-controls. asChild omits the default indicator." },
  { name: "Collapsible.Content", element: "div", description: "Animated content region; wraps slotted content in a spacing body." },
  { name: "Collapsible.Indicator", element: "div", description: "Decorative state indicator with a replaceable default chevron." },
  { name: "Collapsible.Context", element: "slot", description: "Exposes the reactive Ark UI state to a scoped slot." },
  { name: "Collapsible.RootProvider", element: "div", description: "Accepts a state machine created by useCollapsible." },
] as const;

export const events = [
  { name: "update:open", payload: "boolean", description: "Emitted when the controlled open state changes." },
  { name: "openChange", payload: "{ open: boolean }", description: "Ark UI detail emitted after an open-state change." },
  { name: "exitComplete", payload: "void", description: "Emitted after the close transition completes." },
] as const;

export const exportsList = [
  { name: "Collapsible", description: "Compound API exposing Root, RootProvider, Trigger, Content, Indicator, and Context." },
  { name: "CollapsibleRoot", description: "Unaugmented state root component." },
  { name: "CollapsibleRootProvider", description: "Root backed by an external useCollapsible state machine." },
  { name: "CollapsibleTrigger", description: "Keyboard-operable disclosure trigger." },
  { name: "CollapsibleContent", description: "Animated disclosure content." },
  { name: "CollapsibleIndicator", description: "Decorative open-state indicator." },
  { name: "CollapsibleContext", description: "Scoped-slot state access." },
  { name: "useCollapsible", description: "Creates a Collapsible state machine for RootProvider." },
  { name: "useCollapsibleContext", description: "Reads Collapsible state inside the compound component." },
  { name: "collapsibleAnatomy", description: "Ark UI part anatomy metadata." },
  { name: "CollapsibleRootProps", description: "Public root props." },
  { name: "CollapsibleEmits", description: "Root event contract." },
  { name: "CollapsibleOpenChangeDetails", description: "Payload for openChange." },
] as const;
