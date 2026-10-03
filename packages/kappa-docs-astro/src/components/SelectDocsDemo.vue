<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Select,
  createSelectCollection,
} from "@dicehub/kappa/components/select";

type DemoVariant =
  | "preview"
  | "usage"
  | "grouped"
  | "multiple"
  | "placement"
  | "alignment"
  | "sizes"
  | "states"
  | "long-list"
  | "controlled"
  | "rtl";

type Option = {
  disabled?: boolean;
  group?: string;
  label: string;
  value: string;
};

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const regions: Option[] = [
  { label: "EU Central · Frankfurt", value: "eu-central" },
  { label: "EU West · Dublin", value: "eu-west" },
  { label: "US East · Virginia", value: "us-east" },
  { label: "AP Northeast · Tokyo", value: "ap-northeast" },
];

const rtlRegions: Option[] = [
  { label: "فرانكفورت · أوروبا الوسطى", value: "eu-central" },
  { label: "دبلن · أوروبا الغربية", value: "eu-west" },
  { label: "فرجينيا · شرق الولايات المتحدة", value: "us-east" },
  { label: "طوكيو · شمال شرق آسيا", value: "ap-northeast" },
];

const formats: Option[] = [
  { label: "OpenFOAM mesh", value: "openfoam" },
  { label: "Binary mesh", value: "binary" },
  { label: "Fluent mesh", value: "fluent" },
  { label: "STAR-CCM+ mesh", value: "star", disabled: true },
];

const solvers: Option[] = [
  { label: "GAMG", value: "gamg", group: "Pressure" },
  { label: "PCG", value: "pcg", group: "Pressure" },
  { label: "PBiCGStab", value: "pbicgstab", group: "Momentum" },
  { label: "smoothSolver", value: "smooth", group: "Momentum" },
  { label: "diagonal", value: "diagonal", group: "Direct" },
];

const columns: Option[] = [
  { label: "Name", value: "name" },
  { label: "Location", value: "location" },
  { label: "Size", value: "size" },
  { label: "Read", value: "read" },
  { label: "Write", value: "write" },
  { label: "Created at", value: "created-at" },
];

const planets: Option[] = [
  { label: "Mercury", value: "mercury" },
  { label: "Venus", value: "venus" },
  { label: "Earth", value: "earth" },
  { label: "Mars", value: "mars" },
  { label: "Jupiter", value: "jupiter" },
  { label: "Saturn", value: "saturn" },
  { label: "Uranus", value: "uranus" },
  { label: "Neptune", value: "neptune" },
];
const placementPlanets = planets.slice(0, 4);

const sizeOptions: Option[] = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
];

const longListItems: Option[] = Array.from({ length: 50 }, (_, index) => ({
  label: `Option ${String(index + 1).padStart(2, "0")}`,
  value: `option-${index + 1}`,
}));

const collectionOptions = {
  itemToString: (item: Option) => item.label,
  itemToValue: (item: Option) => item.value,
};
const solverCollection = createSelectCollection({
  items: solvers,
  groupBy: (item: Option) => item.group ?? "Other",
  ...collectionOptions,
});

const previewValue = ref<string[]>(["eu-central"]);
const usageValue = ref<string[]>(["openfoam"]);
const groupedValue = ref<string[]>(["gamg"]);
const multipleValue = ref<string[]>(["name", "location", "size"]);
const anchoredPlanet = ref<string[]>(["mars"]);
const alignedPlanet = ref<string[]>(["mars"]);
const controlledValue = ref<string[]>(["eu-west"]);
const longListValue = ref<string[]>([]);
const invalidValue = ref<string[]>([]);
const selectedColumnCount = computed(() => multipleValue.value.length);
</script>

<template>
  <div class="select-demo" :data-select-demo="variant">
    <section v-if="variant === 'preview'" class="select-demo__preview">
      <Select
        id="select-preview"
        v-model="previewValue"
        :items="regions"
        label="Compute region"
        description="Routes the run to the selected cluster."
        name="compute-region"
        placeholder="Select a region"
      />
      <output class="select-demo__readout" aria-live="polite" role="status">
        Region: <strong>{{ previewValue[0] }}</strong>
      </output>
    </section>

    <Select
      v-else-if="variant === 'usage'"
      id="select-usage"
      v-model="usageValue"
      :items="formats"
      label="Mesh format"
      name="mesh-format"
      placeholder="Select a format"
    />

    <Select
      v-else-if="variant === 'grouped'"
      id="select-grouped"
      v-model="groupedValue"
      :collection="solverCollection"
      label="Linear solver"
      name="linear-solver"
    >
      <template #default="{ collection }">
        <Select.Label>Linear solver</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Select a solver" />
            <Select.Indicator />
          </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            <Select.List :render-items="false">
              <Select.Group v-for="[group, items] in collection.group()" :key="group">
                <Select.GroupLabel>{{ group }}</Select.GroupLabel>
                <Select.Item v-for="item in items" :key="item.value" :item="item">
                  {{ item.label }}
                </Select.Item>
              </Select.Group>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </template>
    </Select>

    <section v-else-if="variant === 'multiple'" class="select-demo__stack">
      <Select
        id="select-multiple"
        v-model="multipleValue"
        :items="columns"
        label="Visible columns"
        name="visible-columns"
        multiple
        placeholder="Select columns"
      />
      <p class="select-demo__meta">
        {{ selectedColumnCount }} column{{ selectedColumnCount === 1 ? "" : "s" }} selected
      </p>
    </section>

    <div v-else-if="variant === 'placement'" class="select-demo__placement">
      <Select
        id="select-placement-bottom"
        :default-value="['earth']"
        :items="placementPlanets"
        :positioning="{ flip: false, placement: 'bottom-start' }"
        label="bottom-start (default)"
      />
      <Select
        id="select-placement-top"
        :default-value="['earth']"
        :items="placementPlanets"
        :positioning="{ flip: false, placement: 'top-start' }"
        label="top-start"
      />
      <Select
        id="select-placement-end"
        :default-value="['earth']"
        :items="placementPlanets"
        :positioning="{ flip: false, placement: 'bottom-end' }"
        label="bottom-end"
      />
      <Select
        id="select-placement-gutter"
        :default-value="['earth']"
        :items="placementPlanets"
        :positioning="{ flip: false, gutter: 12, placement: 'bottom-start' }"
        label="gutter: 12"
      />
    </div>

    <div v-else-if="variant === 'alignment'" class="select-demo__alignment">
      <section class="select-demo__alignment-option" data-alignment-example="anchored">
        <div>
          <h4>Anchored (default)</h4>
          <p>Opens below the trigger</p>
        </div>
        <Select
          id="select-alignment-anchored"
          v-model="anchoredPlanet"
          :items="planets"
          aria-label="Anchored planet"
        />
      </section>
      <section class="select-demo__alignment-option" data-alignment-example="selected">
        <div>
          <h4>Aligned to selection</h4>
          <p>Selected option lands on the trigger</p>
        </div>
        <Select
          id="select-alignment-selected"
          v-model="alignedPlanet"
          :items="planets"
          align-item-with-trigger
          aria-label="Aligned planet"
        />
      </section>
    </div>

    <div v-else-if="variant === 'sizes'" class="select-demo__sizes">
      <div
        v-for="size in (['xs', 'sm', 'base', 'lg'] as const)"
        :key="size"
        class="select-demo__size-row"
      >
        <span>{{ size }}</span>
        <Select
          :id="`select-size-${size}`"
          :items="sizeOptions"
          :size="size"
          :aria-label="`Select size ${size}`"
          placeholder="Choose..."
        />
      </div>
    </div>

    <Select
      v-else-if="variant === 'long-list'"
      id="select-long-list"
      v-model="longListValue"
      :items="longListItems"
      label="Long list select"
      description="Tests scrolling behavior with many options."
      placeholder="Choose an option"
    />

    <section v-else-if="variant === 'controlled'" class="select-demo__preview">
      <Select
        id="select-controlled"
        v-model="controlledValue"
        :items="regions"
        label="Failover region"
        name="failover-region"
      />
      <output class="select-demo__readout" aria-live="polite" role="status">
        Controlled value: <strong>{{ controlledValue[0] }}</strong>
      </output>
    </section>

    <Select
      v-else-if="variant === 'rtl'"
      id="select-rtl"
      v-model="previewValue"
      :items="rtlRegions"
      dir="rtl"
      label="منطقة الحساب"
      name="rtl-region"
      placeholder="اختر منطقة"
    />

    <div v-else class="select-demo__states">
      <Select
        id="select-state-disabled"
        :items="formats"
        disabled
        label="Source format"
        placeholder="Unavailable"
      />
      <Select
        id="select-state-readonly"
        :items="formats"
        :default-value="['openfoam']"
        read-only
        label="Pinned format"
      />
      <Select
        id="select-state-invalid"
        v-model="invalidValue"
        :items="formats"
        error="Select one supported output format."
        label="Output format"
        name="output-format"
        placeholder="Required"
        required
      />
    </div>
  </div>
</template>

<style scoped>
.select-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 13rem;
  align-items: center;
  justify-content: center;
  color: var(--docs-default);
}

.select-demo__preview,
.select-demo__stack {
  display: grid;
  inline-size: min(100%, 22rem);
  gap: 0.625rem;
}

.select-demo__readout,
.select-demo__meta {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.select-demo__readout strong {
  color: var(--docs-default);
  font-weight: 600;
}

.select-demo__sizes,
.select-demo__states,
.select-demo__alignment,
.select-demo__placement {
  display: grid;
  inline-size: min(100%, 44rem);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: end;
}

.select-demo__states {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
}

.select-demo__alignment {
  inline-size: min(100%, 44rem);
  align-items: start;
}

.select-demo__alignment-option {
  display: grid;
  min-inline-size: 0;
  gap: 1rem;
}

.select-demo__alignment-option h4,
.select-demo__alignment-option p {
  margin: 0;
}

.select-demo__sizes {
  inline-size: min(100%, 22rem);
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
}

.select-demo__size-row {
  display: grid;
  min-inline-size: 0;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
}

.select-demo__size-row > span {
  color: var(--docs-subtle);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.select-demo__alignment-option h4 {
  color: var(--docs-default);
  font-size: 0.8125rem;
  font-weight: 650;
}

.select-demo__alignment-option p {
  margin-block-start: 0.125rem;
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.select-demo :deep(.kappa-select) {
  inline-size: min(100%, 22rem);
}

.select-demo__sizes :deep(.kappa-select) {
  inline-size: 100%;
}

@media (max-width: 680px) {
  .select-demo {
    min-block-size: 15rem;
  }

  .select-demo__sizes,
  .select-demo__states,
  .select-demo__alignment,
  .select-demo__placement {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
