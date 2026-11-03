<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Field } from "@dicehub/kappa/components/field";
import { Select } from "@dicehub/kappa/components/select";
import { calculateBoundaryLayer, formatCalculatorValue as formatValue } from "./paneled-workspace-calculators";

const props = defineProps<{ page: string }>();
const isYPlus = computed(() => props.page === "Y+ calculator");
const defaults = { speed: "30", distance: "1", viscosity: "0.000015", targetYPlus: "1" };
const inputs = ref({ ...defaults });
const model = ref(["turbulent"]);
const fields = [
  { key: "speed", label: "Freestream velocity (m/s)", help: "Flow speed outside the boundary layer." },
  { key: "distance", label: "Distance from leading edge (m)", help: "Streamwise location where you want the estimate." },
  { key: "viscosity", label: "Kinematic viscosity (m²/s)", help: "Example: 0.000015 m²/s for air near room temperature." },
  { key: "targetYPlus", label: "Target Y+", help: "Use the target required by your wall treatment." },
] as const;
const visibleFields = computed(() => fields.filter(field => isYPlus.value || field.key !== "targetYPlus"));
const positive = (value: string) => value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0;
const valid = computed(() => visibleFields.value.every(field => positive(inputs.value[field.key])));
const result = computed(() => valid.value ? calculateBoundaryLayer({
  speed: Number(inputs.value.speed), distance: Number(inputs.value.distance), viscosity: Number(inputs.value.viscosity),
  targetYPlus: isYPlus.value ? Number(inputs.value.targetYPlus) : 1,
  model: model.value[0] === "laminar" ? "laminar" : "turbulent",
}) : null);
const correlationNote = computed(() => {
  if (!result.value) return "";
  if (model.value[0] === "laminar" && result.value.reynolds > 5e5) return "This Reynolds number is above the usual flat-plate transition estimate. Check whether the flow is still laminar.";
  if (model.value[0] === "turbulent" && result.value.reynolds < 5e5) return "This Reynolds number is below the usual flat-plate transition estimate. Use the turbulent model only if the flow is already turbulent.";
  return "";
});
function reset() { inputs.value = { ...defaults }; model.value = ["turbulent"]; }
</script>

<template>
  <div class="paneled-calculator">
    <p class="paneled-calculator__intro">{{ isYPlus
      ? 'Estimate the wall-to-cell-center distance for a target Y+, and the corresponding first-cell height.'
      : 'Estimate the boundary-layer thickness where velocity reaches approximately 99% of the freestream value.' }}</p>
    <div class="paneled-calculator__layout">
      <form class="paneled-calculator__inputs" :aria-label="`${page} inputs`" @submit.prevent>
        <Select v-model="model" label="Flow model" :items="[{ label: 'Turbulent flat plate', value: 'turbulent' }, { label: 'Laminar flat plate', value: 'laminar' }]" />
        <Field.Root v-for="field in visibleFields" :key="field.key" :invalid="!positive(inputs[field.key])" required>
          <Field.Label>{{ field.label }}</Field.Label>
          <Field.Input v-model="inputs[field.key]" type="number" step="any" min="0" required />
          <Field.HelperText>{{ field.help }}</Field.HelperText>
          <Field.ErrorText v-if="!positive(inputs[field.key])">Enter a finite number greater than zero.</Field.ErrorText>
        </Field.Root>
        <Button variant="outline" size="sm" class="paneled-calculator__reset" @click="reset">Reset values</Button>
      </form>
      <section class="paneled-calculator__results" aria-label="Calculation results" aria-live="polite" aria-atomic="true">
        <h3>Estimated result</h3>
        <template v-if="result">
          <dl class="paneled-calculator__output">
            <template v-if="isYPlus">
              <div><dt>Wall-to-cell-center distance</dt><dd><output>{{ formatValue(result.wallDistance * 1000) }}</output> <span>mm</span></dd></div>
              <div><dt>First-cell height</dt><dd><output>{{ formatValue(result.firstCellHeight * 1000) }}</output> <span>mm</span></dd></div>
            </template>
            <div v-else><dt>Boundary-layer thickness δ₉₉</dt><dd><output>{{ formatValue(result.thickness * 1000) }}</output> <span>mm</span></dd></div>
          </dl>
          <p v-if="isYPlus" class="paneled-calculator__note">First-cell height assumes the cell center is halfway through the layer.</p>
          <dl class="paneled-calculator__details">
            <div><dt>Reynolds number Reₓ</dt><dd>{{ formatValue(result.reynolds) }}</dd></div>
            <div v-if="isYPlus"><dt>Local skin-friction coefficient Cƒ,ₓ</dt><dd>{{ formatValue(result.skinFriction) }}</dd></div>
            <div v-if="isYPlus"><dt>Friction velocity uτ</dt><dd>{{ formatValue(result.frictionVelocity) }} m/s</dd></div>
          </dl>
          <p v-if="correlationNote" class="paneled-calculator__note">{{ correlationNote }}</p>
        </template>
        <p v-else>{{ valid ? 'These values exceed the numeric range. Use smaller input magnitudes.' : 'Enter positive values in all fields to calculate the result.' }}</p>
      </section>
    </div>
    <section class="paneled-calculator__method" aria-label="Calculation method">
      <h3>Method and assumptions</h3>
      <p>Local estimates for incompressible flow over a smooth flat plate with zero pressure gradient. The turbulent model assumes turbulence from the leading edge.</p>
      <p class="paneled-calculator__formula">Reₓ = Ux / ν</p>
      <template v-if="isYPlus">
        <p class="paneled-calculator__formula">{{ model[0] === 'laminar' ? 'Cƒ,ₓ = 0.664 / √Reₓ' : 'Cƒ,ₓ = 0.0592 / Reₓ⁰·²' }}</p>
        <p class="paneled-calculator__formula">uτ = U √(Cƒ,ₓ / 2) · y = Y+ ν / uτ · first-cell height = 2y</p>
        <p>Use this as an initial mesh estimate. Confirm the achieved Y+ from the solved wall shear stress.</p>
      </template>
      <template v-else>
        <p class="paneled-calculator__formula">{{ model[0] === 'laminar' ? 'δ₉₉ ≈ 5x / √Reₓ' : 'δ₉₉ ≈ 0.37x / Reₓ⁰·²' }}</p>
        <p>This estimates physical boundary-layer thickness. Mesh layer count and growth ratio must be set separately.</p>
      </template>
    </section>
  </div>
</template>

<style src="./paneled-workspace-calculators.css"></style>
