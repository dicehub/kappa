export const previewCode = `<script setup lang="ts">
import { PropertyList } from "@dicehub/kappa/components/property-list";

const run = {
  solver: "simpleFoam",
  cells: 2_480_000,
  elapsed: "12 min 34 s",
};
</script>

<template>
  <PropertyList aria-label="Run details">
    <PropertyList.Item label="Solver">{{ run.solver }}</PropertyList.Item>
    <PropertyList.Item label="Cells">{{ run.cells.toLocaleString() }}</PropertyList.Item>
    <PropertyList.Item label="Elapsed time">{{ run.elapsed }}</PropertyList.Item>
  </PropertyList>
</template>`;

export const examples = [
  { id: "compact", title: "Compact", description: "Small text and short rows for side panels and technical summaries.",
    code: `<script setup lang="ts">
const summary = { solver: "simpleFoam", cells: 2_480_000 };
</script>

<template>
  <PropertyList size="sm">
    <PropertyList.Item label="Solver">{{ summary.solver }}</PropertyList.Item>
    <PropertyList.Item label="Cells">{{ summary.cells.toLocaleString() }}</PropertyList.Item>
  </PropertyList>
</template>` },
  { id: "stacked", title: "Stacked and custom content", description: "Place each value below its label. Slots accept links, badges, and controls.",
    code: `<script setup lang="ts">
import { ref } from "vue";

const showChecks = ref(false);
const checkResult = "No negative volumes.";
</script>

<template>
  <PropertyList layout="stacked">
    <PropertyList.Item>
      <PropertyList.Term>Mesh verification</PropertyList.Term>
      <PropertyList.Value>
        <Button size="sm" variant="link" @click="showChecks = !showChecks">Show checks</Button>
        <p v-if="showChecks">{{ checkResult }}</p>
      </PropertyList.Value>
    </PropertyList.Item>
  </PropertyList>
</template>` },
  { id: "long", title: "Long values", description: "Long paths and notes wrap. Horizontal rows stack when the list is narrower than 24rem.",
    code: `<script setup lang="ts">
const outputDirectory = "/projects/external-aerodynamics/runs/reference/postProcessing/forceCoeffs/0";
const notes = "All residuals reached the specified tolerance.";
</script>

<template>
  <PropertyList divided style="--kappa-property-list-label-width: 10rem">
    <PropertyList.Item label="Output directory">
      <code>{{ outputDirectory }}</code>
    </PropertyList.Item>
    <PropertyList.Item label="Notes">{{ notes }}</PropertyList.Item>
  </PropertyList>
</template>` },
] as const;
