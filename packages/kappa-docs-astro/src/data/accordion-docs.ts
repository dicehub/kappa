export const barrelCode = `import {
  Accordion,
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionIndicator,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Accordion,
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionIndicator,
} from "@dicehub/kappa/components/accordion";`;

export const previewCode = `<script setup>
import { Accordion } from "@dicehub/kappa/components/accordion";

const sections = [
  {
    value: "mesh",
    title: "Mesh",
    detail: "2.4 million cells across 24 partitions. Quality checks passed.",
  },
  {
    value: "solver",
    title: "Solver",
    detail: "The PIMPLE solver runs six correctors with an adaptive time step.",
  },
  {
    value: "results",
    title: "Results",
    detail: "Pressure, velocity, and force histories are available for review.",
  },
];
</script>

<template>
  <Accordion.Root :default-value="['mesh']">
    <Accordion.Item v-for="section in sections" :key="section.value" :value="section.value">
      <Accordion.Trigger>
        {{ section.title }}
      </Accordion.Trigger>
      <Accordion.Content>{{ section.detail }}</Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</template>`;

export const usageCode = `<script setup>
import { Accordion } from "@dicehub/kappa/components/accordion";
</script>

<template>
  <Accordion.Root :default-value="['setup']">
    <Accordion.Item value="setup">
      <Accordion.Trigger>
        Case setup
      </Accordion.Trigger>
      <Accordion.Content>
        Select the mesh, solver, and boundary conditions for this run. The section can contain
        links, settings, tables, or any other Vue content.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionIndicator,
} from "@dicehub/kappa/components/accordion";
</script>

<template>
  <AccordionRoot :default-value="['mesh']">
    <AccordionItem value="mesh">
      <AccordionTrigger>
        Mesh quality
        <template #indicator><AccordionIndicator /></template>
      </AccordionTrigger>
      <AccordionContent>
        Maximum non-orthogonality is 48.2° and maximum skewness is 1.84. Both values remain
        inside the accepted quality limits.
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>`;

export const basicCode = `<script setup>
import { Accordion } from "@dicehub/kappa/components/accordion";
</script>

<template>
  <Accordion.Root :default-value="['geometry']">
    <Accordion.Item value="geometry">
      <Accordion.Trigger>Geometry</Accordion.Trigger>
      <Accordion.Content>
        The geometry contains 12 watertight regions. Surface checks found no open edges or
        self-intersections.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="mesh">
      <Accordion.Trigger>Mesh</Accordion.Trigger>
      <Accordion.Content>
        The volume mesh contains 2.4 million cells across 24 partitions. All quality checks
        passed before decomposition.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</template>`;

export const multipleCode = `<script setup>
import { Accordion } from "@dicehub/kappa/components/accordion";
</script>

<template>
  <Accordion.Root :default-value="['mesh', 'boundaries']" multiple collapsible>
    <Accordion.Item value="mesh">
      <Accordion.Trigger>Mesh summary</Accordion.Trigger>
      <Accordion.Content>
        The mesh contains 2.4 million cells across 24 balanced partitions. The largest load
        imbalance is 1.7%.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="boundaries">
      <Accordion.Trigger>Boundary summary</Accordion.Trigger>
      <Accordion.Content>
        Seven boundary patches are ready for review. Inlet, outlet, and wall conditions are
        assigned to every face.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</template>`;

export const disabledCode = `<script setup>
import { Accordion } from "@dicehub/kappa/components/accordion";
</script>

<template>
  <Accordion.Root :default-value="['mesh']">
    <Accordion.Item value="mesh">
      <Accordion.Trigger>Mesh</Accordion.Trigger>
      <Accordion.Content>
        Mesh diagnostics are available. Review cell quality, patch coverage, and partition
        balance before starting the run.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="decomposition" disabled>
      <Accordion.Trigger>Domain decomposition</Accordion.Trigger>
      <Accordion.Content>
        Decomposition is unavailable while meshing. It becomes available after the mesh passes
        its final quality check.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="solver">
      <Accordion.Trigger>Solver</Accordion.Trigger>
      <Accordion.Content>
        Solver controls are ready. The selected tolerances and relaxation factors have been
        validated for this case.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Accordion } from "@dicehub/kappa/components/accordion";

const openPanels = ref(["residuals"]);
</script>

<template>
  <Accordion.Root v-model="openPanels" collapsible>
    <Accordion.Item value="residuals">
      <Accordion.Trigger>Residuals</Accordion.Trigger>
      <Accordion.Content>
        All normalized residuals are below 1e-5. Pressure has fallen by more than four orders
        of magnitude since the first iteration.
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="forces">
      <Accordion.Trigger>Forces</Accordion.Trigger>
      <Accordion.Content>
        The mean drag coefficient is 0.31 over the latest sampling window. Oscillation remains
        below 0.6%.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
  <p>Open panels: {{ openPanels.join(", ") || "none" }}</p>
</template>`;

export const rtlCode = `<script setup>
import { Accordion } from "@dicehub/kappa/components/accordion";
</script>

<template>
  <div dir="rtl">
    <Accordion.Root dir="rtl" :default-value="['results']" collapsible>
      <Accordion.Item value="results">
        <Accordion.Trigger>نتائج المحاكاة</Accordion.Trigger>
        <Accordion.Content>
          الضغط والسرعة جاهزان للمراجعة. اكتملت آخر عملية كتابة عند ٢٫٤ ثانية.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </div>
</template>`;

export const lazyCode = `<script setup>
import { Accordion } from "@dicehub/kappa/components/accordion";
</script>

<template>
  <Accordion.Root lazy-mount unmount-on-exit collapsible>
    <Accordion.Item value="plots">
      <Accordion.Trigger>Residual plots</Accordion.Trigger>
      <Accordion.Content>
        Residual plots mount only while this item is open. Closing the section removes the chart
        from the document and releases its observers.
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</template>`;

export const rootProps = [
  { name: "modelValue", type: "string[]", defaultValue: "-", description: "Controlled list of expanded item values; supports v-model." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initially expanded values for uncontrolled use." },
  { name: "collapsible", type: "boolean", defaultValue: "false", description: "Allows the last expanded item to close." },
  { name: "multiple", type: "boolean", defaultValue: "false", description: "Allows more than one item to remain expanded." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables every item in the accordion." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "inherited", description: "Sets logical direction and horizontal keyboard navigation." },
  { name: "orientation", type: '"vertical" | "horizontal"', defaultValue: '"vertical"', description: "Sets layout and directional keyboard behavior." },
  { name: "lazyMount", type: "boolean", defaultValue: "false", description: "Defers panel mounting until its first expansion." },
  { name: "unmountOnExit", type: "boolean", defaultValue: "false", description: "Removes panel content after its close transition." },
  { name: "id", type: "string", defaultValue: "generated", description: "Stable identifier for the accordion state machine." },
  { name: "ids", type: "AccordionRootProps['ids']", defaultValue: "generated", description: "Overrides generated root, item, trigger, and content IDs." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior into the single child element." },
] as const;

export const itemProps = [
  { name: "value", type: "string", defaultValue: "required", description: "Stable value identifying the item." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables this item and removes it from arrow-key navigation." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges item behavior into the single child element." },
] as const;

export const partProps = [
  { name: "Accordion.Trigger", element: "button", description: "Toggles its item and manages focus and ARIA relationships." },
  { name: "Accordion.Content", element: "div", description: "Animated region associated with its trigger." },
  { name: "Accordion.Indicator", element: "div", description: "Decorative state indicator that follows the item state." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string[]", description: "Emitted whenever the controlled expanded values change." },
  { name: "valueChange", payload: "{ value: string[] }", description: "Ark UI detail emitted after an item opens or closes." },
  { name: "focusChange", payload: "{ value: string | null }", description: "Ark UI detail emitted when trigger focus changes." },
] as const;

export const exportsList = [
  { name: "Accordion", description: "Compound API exposing Root, Item, Trigger, Content, and Indicator." },
  { name: "AccordionRoot", description: "Unaugmented root component." },
  { name: "AccordionItem", description: "Item state and value boundary." },
  { name: "AccordionTrigger", description: "Keyboard-operable item trigger." },
  { name: "AccordionContent", description: "Animated item content region." },
  { name: "AccordionIndicator", description: "Decorative disclosure indicator." },
  { name: "AccordionRootProps", description: "Public root props and Ark UI state contract." },
  { name: "AccordionItemProps", description: "Public item props." },
  { name: "AccordionEmits", description: "Root event contract." },
  { name: "AccordionSlots", description: "Root slot contract." },
  { name: "AccordionItemSlots", description: "Item slot contract." },
  { name: "AccordionTriggerSlots", description: "Trigger default and indicator slot contract." },
  { name: "AccordionContentSlots", description: "Content slot contract." },
  { name: "AccordionIndicatorSlots", description: "Indicator slot contract." },
  { name: "AccordionDirection", description: "Supported logical direction union." },
  { name: "AccordionOrientation", description: "Supported orientation union." },
  { name: "AccordionValueChangeDetails", description: "Payload for valueChange." },
  { name: "AccordionFocusChangeDetails", description: "Payload for focusChange." },
] as const;
