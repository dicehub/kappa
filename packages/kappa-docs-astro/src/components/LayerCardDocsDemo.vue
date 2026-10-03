<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import { computed, ref } from "vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { LayerCard } from "@dicehub/kappa/components/layer-card";
import { Tabs } from "@dicehub/kappa/components/tabs";

type DemoVariant =
  | "preview"
  | "usage"
  | "layered"
  | "simple"
  | "linked"
  | "states"
  | "filter-toolbar";
type RequestStatus = "2xx" | "3xx" | "4xx" | "5xx";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const statusFilters = [
  { value: "all", label: "All" },
  { value: "2xx", label: "2xx" },
  { value: "3xx", label: "3xx" },
  { value: "4xx", label: "4xx" },
  { value: "5xx", label: "5xx" },
] as const;

const requestLog: Array<{
  origin: string;
  status: RequestStatus;
  count: number;
  duration: string;
}> = [
  { origin: "api.dicehub.com /v1/runs", status: "2xx", count: 1842, duration: "118 ms" },
  { origin: "cdn.dicehub.com /preview/*", status: "2xx", count: 3208, duration: "42 ms" },
  { origin: "assets.dicehub.com /meshes/*", status: "3xx", count: 412, duration: "64 ms" },
  { origin: "legacy.dicehub.com /v0/solve", status: "4xx", count: 96, duration: "812 ms" },
  { origin: "telemetry.dicehub.com /ingest", status: "4xx", count: 58, duration: "310 ms" },
  { origin: "gateway.dicehub.com /solver/health", status: "5xx", count: 12, duration: "2.4 s" },
];

const statusVariants = {
  "2xx": "success",
  "3xx": "info",
  "4xx": "warning",
  "5xx": "error",
} as const;

const search = ref("");
const activeStatus = ref("all");

const visibleRequests = computed(() => {
  const query = search.value.trim().toLowerCase();

  return requestLog.filter(
    (request) =>
      (activeStatus.value === "all" || request.status === activeStatus.value) &&
      (!query || request.origin.toLowerCase().includes(query)),
  );
});

const resetFilters = () => {
  search.value = "";
  activeStatus.value = "all";
};
</script>

<template>
  <div class="layer-card-demo" :data-layer-card-demo="props.variant">
    <LayerCard v-if="props.variant === 'preview'" class="layer-card-demo__card">
      <LayerCard.Secondary as="header">
        <span>Run 214</span>
        <Badge variant="success">Converged</Badge>
      </LayerCard.Secondary>
      <LayerCard.Primary>
        <strong class="layer-card-demo__title">Steady-state thermal analysis</strong>
        <span class="layer-card-demo__muted">Residual 2.1e-05 after 42 iterations.</span>
      </LayerCard.Primary>
    </LayerCard>

    <LayerCard
      v-else-if="props.variant === 'usage'"
      as="article"
      class="layer-card-demo__card"
    >
      <LayerCard.Secondary as="header">Solver configuration</LayerCard.Secondary>
      <LayerCard.Primary>
        <strong class="layer-card-demo__title">Rotor refinement</strong>
        <span class="layer-card-demo__muted">Mesh 4.2M cells · k-ω SST · 8 workers</span>
        <dl class="layer-card-demo__facts">
          <div><dt>Iterations</dt><dd>42</dd></div>
          <div><dt>Wall time</dt><dd>4 min 12 s</dd></div>
        </dl>
      </LayerCard.Primary>
    </LayerCard>

    <LayerCard
      v-else-if="props.variant === 'layered'"
      as="article"
      class="layer-card-demo__card"
    >
      <LayerCard.Secondary as="header">Deployment window</LayerCard.Secondary>
      <LayerCard.Primary>
        <strong class="layer-card-demo__title">Tuesday, 18:00–19:00 UTC</strong>
        <span class="layer-card-demo__muted">
          Four services, twelve checks, no maintenance window conflicts.
        </span>
        <dl class="layer-card-demo__facts">
          <div><dt>Services</dt><dd>4</dd></div>
          <div><dt>Checks</dt><dd>12 / 12</dd></div>
        </dl>
      </LayerCard.Primary>
    </LayerCard>

    <LayerCard
      v-else-if="props.variant === 'simple'"
      as="section"
      class="layer-card-demo__card"
    >
      <p class="layer-card-demo__eyebrow">Solver diagnostics</p>
      <p class="layer-card-demo__body">
        All convergence checks passed. The solution is ready to export.
      </p>
    </LayerCard>

    <LayerCard v-else-if="props.variant === 'linked'" class="layer-card-demo__card">
      <LayerCard.Secondary as="header">Release notes</LayerCard.Secondary>
      <LayerCard.Primary as="a" href="#interactive-primary" data-interactive-primary>
        <strong class="layer-card-demo__title layer-card-demo__title--row">
          Read the component model
          <ArrowRight :size="16" aria-hidden="true" />
        </strong>
        <span class="layer-card-demo__muted">The primary layer is one semantic anchor.</span>
      </LayerCard.Primary>
    </LayerCard>

    <LayerCard
      v-else-if="props.variant === 'filter-toolbar'"
      as="section"
      class="layer-card-demo__card layer-card-demo__card--wide"
      data-filter-toolbar
    >
      <LayerCard.Secondary as="header">
        <span>Request log</span>
        <span class="layer-card-demo__meta">{{ visibleRequests.length }} / {{ requestLog.length }}</span>
      </LayerCard.Secondary>
      <LayerCard.Primary>
        <div class="layer-card-demo__toolbar">
          <Input
            v-model="search"
            aria-label="Filter origins"
            class="layer-card-demo__search"
            placeholder="Filter origins..."
            size="sm"
            type="search"
          />
          <Tabs.Root v-model="activeStatus">
            <Tabs.List size="sm" aria-label="Filter by status">
              <Tabs.Trigger
                v-for="filter in statusFilters"
                :key="filter.value"
                :value="filter.value"
              >
                {{ filter.label }}
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
          </Tabs.Root>
        </div>
        <table class="layer-card-demo__table" aria-label="Request origins">
          <thead>
            <tr>
              <th scope="col">Origin</th>
              <th scope="col">Status</th>
              <th scope="col" class="layer-card-demo__numeric">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in visibleRequests" :key="request.origin">
              <th scope="row" class="layer-card-demo__origin">{{ request.origin }}</th>
              <td>
                <Badge :variant="statusVariants[request.status]">
                  {{ request.status }} · {{ request.count }}
                </Badge>
              </td>
              <td class="layer-card-demo__numeric layer-card-demo__duration">
                {{ request.duration }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="visibleRequests.length === 0" class="layer-card-demo__empty" role="status">
          <span>No origins match the current filter.</span>
          <Button size="xs" variant="outline" @click="resetFilters">Reset filters</Button>
        </div>
        <p class="layer-card-demo__footer">
          Showing {{ visibleRequests.length }} of {{ requestLog.length }} requests
        </p>
      </LayerCard.Primary>
    </LayerCard>

    <div v-else class="layer-card-demo__states">
      <LayerCard
        as="a"
        href="#layered-states"
        class="layer-card-demo__card layer-card-demo__card--compact"
        data-interactive-root
      >
        <span class="layer-card-demo__eyebrow">Linked root surface</span>
        <span class="layer-card-demo__muted">Hover and keyboard focus are visible.</span>
      </LayerCard>

      <LayerCard class="layer-card-demo__card layer-card-demo__card--compact">
        <LayerCard.Secondary as="header">Primary link</LayerCard.Secondary>
        <LayerCard.Primary as="a" href="#layered-states" data-interactive-primary>
          <strong class="layer-card-demo__title">Open the run report</strong>
          <span class="layer-card-demo__muted">Focus stays inside the layered surface.</span>
        </LayerCard.Primary>
      </LayerCard>
    </div>
  </div>
</template>

<style scoped src="./LayerCardDocsDemo.css"></style>
