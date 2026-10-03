export const barrelCode = `import {
  LayerCard,
  LayerCardPrimary,
  LayerCardRoot,
  LayerCardSecondary,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  LayerCard,
  LayerCardPrimary,
  LayerCardRoot,
  LayerCardSecondary,
} from "@dicehub/kappa/components/layer-card";`;

export const previewCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
import { LayerCard } from "@dicehub/kappa/components/layer-card";
</script>

<template>
  <LayerCard style="width: 23rem;">
    <LayerCard.Secondary as="header">
      <span>Run 214</span>
      <Badge variant="success">Converged</Badge>
    </LayerCard.Secondary>
    <LayerCard.Primary>
      <strong>Steady-state thermal analysis</strong>
      <span>Residual 2.1e-05 after 42 iterations.</span>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

export const usageCode = `<script setup>
import { LayerCard } from "@dicehub/kappa/components/layer-card";
</script>

<template>
  <LayerCard as="article" style="width: 23rem;">
    <LayerCard.Secondary as="header">Solver configuration</LayerCard.Secondary>
    <LayerCard.Primary>
      <strong>Rotor refinement</strong>
      <span>Mesh 4.2M cells · k-ω SST · 8 workers</span>
      <dl>
        <div><dt>Iterations</dt><dd>42</dd></div>
        <div><dt>Wall time</dt><dd>4 min 12 s</dd></div>
      </dl>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

const layeredCode = `<script setup>
import { LayerCard } from "@dicehub/kappa/components/layer-card";
</script>

<template>
  <LayerCard as="article" style="width: 23rem;">
    <LayerCard.Secondary as="header">Deployment window</LayerCard.Secondary>
    <LayerCard.Primary>
      <strong>Tuesday, 18:00–19:00 UTC</strong>
      <span>Four services, twelve checks, no maintenance window conflicts.</span>
      <dl>
        <div><dt>Services</dt><dd>4</dd></div>
        <div><dt>Checks</dt><dd>12 / 12</dd></div>
      </dl>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

const simpleCode = `<script setup>
import { LayerCard } from "@dicehub/kappa/components/layer-card";
</script>

<template>
  <LayerCard as="section" style="width: 23rem;">
    <p><strong>Solver diagnostics</strong></p>
    <p>All convergence checks passed. The solution is ready to export.</p>
  </LayerCard>
</template>`;

const interactiveCode = `<script setup>
import { ArrowRight } from "@lucide/vue";
import { LayerCard } from "@dicehub/kappa/components/layer-card";
</script>

<template>
  <LayerCard style="width: 23rem;">
    <LayerCard.Secondary as="header">Release notes</LayerCard.Secondary>
    <LayerCard.Primary as="a" href="/release-notes">
      <strong>Read the component model <ArrowRight aria-hidden="true" /></strong>
      <span>The primary layer is one semantic anchor.</span>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

const statesCode = `<script setup>
import { LayerCard } from "@dicehub/kappa/components/layer-card";
</script>

<template>
  <LayerCard as="a" href="/reports/run-214" style="width: 23rem;">
    <span>Linked root surface</span>
    <span>Hover and keyboard focus are visible.</span>
  </LayerCard>

  <LayerCard style="width: 23rem;">
    <LayerCard.Secondary as="header">Primary link</LayerCard.Secondary>
    <LayerCard.Primary as="a" href="/reports/run-214">
      <strong>Open the run report</strong>
      <span>Focus stays inside the layered surface.</span>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

const filterToolbarCode = `<script setup>
import { computed, ref } from "vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Input } from "@dicehub/kappa/components/input";
import { LayerCard } from "@dicehub/kappa/components/layer-card";
import { Tabs } from "@dicehub/kappa/components/tabs";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "2xx", label: "2xx" },
  { value: "3xx", label: "3xx" },
  { value: "4xx", label: "4xx" },
  { value: "5xx", label: "5xx" },
];
const statusVariants = { "2xx": "success", "3xx": "info", "4xx": "warning", "5xx": "error" };
const requests = [
  { origin: "api.dicehub.com /v1/runs", status: "2xx", count: 1842, duration: "118 ms" },
  { origin: "legacy.dicehub.com /v0/solve", status: "4xx", count: 96, duration: "812 ms" },
  { origin: "gateway.dicehub.com /solver/health", status: "5xx", count: 12, duration: "2.4 s" },
  // …more origins
];

const search = ref("");
const status = ref("all");
const visible = computed(() => {
  const query = search.value.trim().toLowerCase();
  return requests.filter((request) =>
    (status.value === "all" || request.status === status.value) &&
    (!query || request.origin.toLowerCase().includes(query)),
  );
});
</script>

<template>
  <LayerCard as="section" style="width: 34rem;">
    <LayerCard.Secondary as="header">
      <span>Request log</span>
      <span>{{ visible.length }} / {{ requests.length }}</span>
    </LayerCard.Secondary>
    <LayerCard.Primary>
      <div class="toolbar">
        <Input v-model="search" aria-label="Filter origins" size="sm" placeholder="Filter origins..." />
        <Tabs.Root v-model="status">
          <Tabs.List aria-label="Filter by status" size="sm">
            <Tabs.Trigger v-for="filter in statusFilters" :key="filter.value" :value="filter.value">
              {{ filter.label }}
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
        </Tabs.Root>
      </div>
      <table aria-label="Request origins">
        <thead>
          <tr><th scope="col">Origin</th><th scope="col">Status</th><th scope="col">Duration</th></tr>
        </thead>
        <tbody>
          <tr v-for="request in visible" :key="request.origin">
            <th scope="row">{{ request.origin }}</th>
            <td><Badge :variant="statusVariants[request.status]">{{ request.status }} · {{ request.count }}</Badge></td>
            <td>{{ request.duration }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="visible.length === 0" role="status">No origins match the current filter.</p>
      <p>Showing {{ visible.length }} of {{ requests.length }} requests</p>
    </LayerCard.Primary>
  </LayerCard>
</template>`;

export const examples = [
  {
    id: "layered-content",
    title: "Layered Content",
    description: "Pair a secondary context layer with one raised primary surface.",
    variant: "layered",
    code: layeredCode,
  },
  {
    id: "simple-surface",
    title: "Simple Surface",
    description: "Use direct root content when one surface is enough.",
    variant: "simple",
    code: simpleCode,
  },
  {
    id: "interactive-primary",
    title: "Interactive Primary Link",
    description: "Render Primary as an anchor when the whole layer has one target.",
    variant: "linked",
    code: interactiveCode,
  },
  {
    id: "layered-states",
    title: "Layered States",
    description: "Hover and focus-visible styles cover linked roots and linked primaries.",
    variant: "states",
    code: statesCode,
  },
  {
    id: "filter-toolbar-with-small-tabs",
    title: "Filter Toolbar with Small Tabs",
    description:
      "Compose small tabs, a search input, and a status table inside one dense primary layer.",
    variant: "filter-toolbar",
    code: filterToolbarCode,
  },
] as const;

export const rootProps = [
  {
    name: "as",
    type: '"div" | "article" | "section" | "aside" | "a" | "form"',
    defaultValue: '"div"',
    description: "Native element rendered by the outer surface.",
  },
  {
    name: "default slot",
    type: "slot",
    defaultValue: "—",
    description: "Secondary and Primary layers, or direct surface content.",
  },
] as const;

export const parts = [
  {
    name: "LayerCard.Secondary",
    element: '"div" | "header" | "p"',
    defaultValue: '"div"',
    description: "Supporting layer behind the primary surface.",
  },
  {
    name: "LayerCard.Primary",
    element: '"div" | "article" | "section" | "a"',
    defaultValue: '"div"',
    description: "Raised content surface with square corners.",
  },
] as const;

export const dataSlots = [
  ["layer-card", "Outer surface"],
  ["layer-card-secondary", "Supporting layer"],
  ["layer-card-primary", "Raised primary layer"],
] as const;

export const exportsList = [
  { name: "LayerCard", description: "Compound root with the Root, Primary, and Secondary parts." },
  { name: "LayerCardRoot", description: "Named outer surface export." },
  { name: "LayerCardPrimary / LayerCardSecondary", description: "Named layered-surface exports." },
  {
    name: "LayerCard*Props / LayerCard*Slots",
    description: "Public prop and slot contracts.",
  },
  {
    name: "resolveLayerCard*",
    description: "Safe runtime resolvers for the semantic element props.",
  },
] as const;
