<script setup lang="ts">
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { PropertyList } from "@dicehub/kappa/components/property-list";
import { ref } from "vue";
withDefaults(defineProps<{ variant?: "preview" | "compact" | "stacked" | "long" }>(), { variant: "preview" });
const expanded = ref(false);
</script>

<template>
  <div class="property-list-demo" :data-property-list-demo="variant">
    <h3 class="property-list-demo__heading">
      {{ variant === "compact" ? "Mesh summary" : "Run details" }}
    </h3>
    <PropertyList :size="variant === 'compact' ? 'sm' : 'base'"
      :layout="variant === 'stacked' ? 'stacked' : 'horizontal'"
      :divided="variant === 'long'" aria-label="Run properties">
      <PropertyList.Item label="Status"><Badge variant="secondary">Completed</Badge></PropertyList.Item>
      <PropertyList.Item label="Solver">simpleFoam</PropertyList.Item>
      <PropertyList.Item label="Cells">2,480,000</PropertyList.Item>
      <PropertyList.Item v-if="variant !== 'compact'" label="Elapsed time">12 min 34 s</PropertyList.Item>
      <PropertyList.Item v-if="variant === 'long'" label="Output directory">
        <code>/projects/external-aerodynamics/runs/2026-09-21/steady-state-reference-simulation/postProcessing/forceCoeffs/0</code>
      </PropertyList.Item>
      <PropertyList.Item v-if="variant === 'long'" label="Notes">
        The case uses a refined boundary layer near the wing surface. All residuals reached the
        specified tolerance. The pressure and velocity fields are ready for review.
      </PropertyList.Item>
      <PropertyList.Item v-if="variant === 'stacked'">
        <PropertyList.Term>Mesh verification</PropertyList.Term>
        <PropertyList.Value>
          <Button size="sm" variant="link" :aria-expanded="expanded" @click="expanded = !expanded">
            {{ expanded ? "Hide checks" : "Show checks" }}
          </Button>
          <p v-if="expanded">No negative volumes. Maximum non-orthogonality: 48°.</p>
        </PropertyList.Value>
      </PropertyList.Item>
    </PropertyList>
  </div>
</template>

<style scoped>
.property-list-demo { inline-size: 100%; max-inline-size: 38rem; min-inline-size: 0; }
.property-list-demo[data-property-list-demo="compact"] { max-inline-size: 28rem; }
.property-list-demo__heading { padding-block-end: 0.75rem; margin: 0 0 0.25rem; border-block-end: 1px solid var(--kappa-line); color: var(--kappa-default); font-size: 0.875rem; font-weight: 600; }
.property-list-demo code { font-size: 0.75rem; }
</style>
