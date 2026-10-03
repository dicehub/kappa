<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import {
  Combobox,
  createComboboxCollection,
} from "@dicehub/kappa/components/combobox";

type DemoVariant =
  | "preview"
  | "usage"
  | "popup-search"
  | "custom-trigger"
  | "grouped"
  | "multiple"
  | "sizes"
  | "states";

type Option = {
  disabled?: boolean;
  group?: string;
  label: string;
  meta?: string;
  value: string;
};

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const regions: Option[] = [
  { label: "EU Central · Frankfurt", value: "eu-central", meta: "18 ms" },
  { label: "EU West · Dublin", value: "eu-west", meta: "24 ms" },
  { label: "US East · Virginia", value: "us-east", meta: "92 ms" },
  { label: "US West · Oregon", value: "us-west", meta: "138 ms" },
  { label: "AP Northeast · Tokyo", value: "ap-northeast", meta: "226 ms" },
  { label: "AP Southeast · Singapore", value: "ap-southeast", meta: "194 ms" },
];

const languages: Option[] = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Spanish", value: "es" },
];

const solvers: Option[] = [
  { label: "GAMG", value: "gamg", group: "Pressure" },
  { label: "PCG", value: "pcg", group: "Pressure" },
  { label: "PBiCGStab", value: "pbicgstab", group: "Momentum" },
  { label: "smoothSolver", value: "smooth", group: "Momentum" },
  { label: "diagonal", value: "diagonal", group: "Direct" },
];

const formats: Option[] = [
  { label: "Binary mesh", value: "binary" },
  { label: "Fluent mesh", value: "fluent" },
  { label: "OpenFOAM mesh", value: "openfoam" },
  { label: "STAR-CCM+ mesh", value: "star", disabled: true },
];

const tags: Option[] = [
  { label: "Baseline", value: "baseline" },
  { label: "Converged", value: "converged" },
  { label: "Needs review", value: "review" },
  { label: "Production", value: "production" },
  { label: "Transient", value: "transient" },
];

const collectionOptions = {
  itemToString: (item: Option) => item.label,
  itemToValue: (item: Option) => item.value,
};
const languageCollection = createComboboxCollection({ items: languages, ...collectionOptions });
const formatCollection = createComboboxCollection({
  items: formats,
  isItemDisabled: (item: Option) => item.disabled === true,
  ...collectionOptions,
});
const solverCollection = createComboboxCollection({
  items: solvers,
  groupBy: (item: Option) => item.group ?? "Other",
  ...collectionOptions,
});
const tagCollection = createComboboxCollection({ items: tags, ...collectionOptions });

const previewValue = ref(["eu-central"]);
const usageValue = ref(["openfoam"]);
const popupValue = ref(["en"]);
const customValue = ref(["de"]);
const groupedValue = ref(["gamg"]);
const multipleValue = ref<string[]>(["baseline"]);
const invalidValue = ref<string[]>([]);
const sizeValue = ref(["eu-west"]);
const selectedTagCount = computed(() => multipleValue.value.length);
</script>

<template>
  <div class="combobox-demo" :data-combobox-demo="variant">
    <Combobox
      v-if="variant === 'preview'"
      v-model="previewValue"
      class="combobox-demo__control"
      :items="regions"
      label="Compute region"
      description="Routes the run to the selected cluster."
      input-behavior="autohighlight"
      placeholder="Select a region"
    >
      <template #item="{ item }">
        <span>{{ (item as Option).label }}</span>
        <small>{{ (item as Option).meta }}</small>
      </template>
    </Combobox>

    <Combobox
      v-else-if="variant === 'usage'"
      v-model="usageValue"
      class="combobox-demo__control"
      :collection="formatCollection"
      label="Mesh format"
    >
      <Combobox.TriggerInput placeholder="Select a format" />
      <Combobox.Content>
        <Combobox.Empty>No matching format.</Combobox.Empty>
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ (item as Option).label }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>

    <Combobox
      v-else-if="variant === 'popup-search'"
      v-model="popupValue"
      class="combobox-demo__control"
      :collection="languageCollection"
    >
      <Combobox.TriggerValue placeholder="Select a language" />
      <Combobox.Content>
        <Combobox.Input aria-label="Search languages" placeholder="Search languages" />
        <Combobox.Empty>No matching language.</Combobox.Empty>
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ (item as Option).label }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>

    <Combobox
      v-else-if="variant === 'custom-trigger'"
      v-model="customValue"
      class="combobox-demo__custom-root"
      :collection="languageCollection"
    >
      <Combobox.Trigger as-child>
        <Button variant="outline" class="combobox-demo__custom-trigger">
          Language: <Combobox.Value />
        </Button>
      </Combobox.Trigger>
      <Combobox.Content :same-width="false">
        <Combobox.List>
          <template #default="{ item }">
            <Combobox.Item :item="item">{{ (item as Option).label }}</Combobox.Item>
          </template>
        </Combobox.List>
      </Combobox.Content>
    </Combobox>

    <Combobox
      v-else-if="variant === 'grouped'"
      v-model="groupedValue"
      class="combobox-demo__control"
      :collection="solverCollection"
      label="Linear solver"
    >
      <template #default="{ collection }">
        <Combobox.TriggerInput placeholder="Select a solver" />
        <Combobox.Content>
          <Combobox.Empty>No matching solver.</Combobox.Empty>
          <Combobox.List :render-items="false">
            <Combobox.Group v-for="[group, items] in collection.group()" :key="group">
              <Combobox.GroupLabel>{{ group }}</Combobox.GroupLabel>
              <Combobox.Item v-for="item in items" :key="item.value" :item="item">
                {{ item.label }}
              </Combobox.Item>
            </Combobox.Group>
          </Combobox.List>
        </Combobox.Content>
      </template>
    </Combobox>

    <div v-else-if="variant === 'multiple'" class="combobox-demo__stack">
      <Combobox
        v-model="multipleValue"
        class="combobox-demo__control"
        :collection="tagCollection"
        label="Run tags"
        multiple
      >
        <Combobox.TriggerMultipleWithInput placeholder="Add a tag" />
        <Combobox.Content>
          <Combobox.Empty>No matching tag.</Combobox.Empty>
          <Combobox.List>
            <template #default="{ item }">
              <Combobox.Item :item="item">{{ (item as Option).label }}</Combobox.Item>
            </template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
      <p class="combobox-demo__meta">{{ selectedTagCount }} tags selected</p>
    </div>

    <div v-else-if="variant === 'sizes'" class="combobox-demo__sizes">
      <Combobox
        v-for="size in (['xs', 'sm', 'base', 'lg'] as const)"
        :key="size"
        v-model="sizeValue"
        :items="regions"
        :size="size"
      >
        <Combobox.TriggerInput :aria-label="`${size} region`" :placeholder="size" />
        <Combobox.Content>
          <Combobox.List>
            <template #default="{ item }">
              <Combobox.Item :item="item">{{ (item as Option).label }}</Combobox.Item>
            </template>
          </Combobox.List>
        </Combobox.Content>
      </Combobox>
    </div>

    <div v-else class="combobox-demo__states">
      <Combobox
        class="combobox-demo__state-control"
        :items="formats"
        disabled
        label="Source format"
        placeholder="Unavailable"
      />
      <Combobox
        v-model="invalidValue"
        class="combobox-demo__state-control"
        :items="formats"
        error="Select one supported output format."
        label="Output format"
        placeholder="Required"
        required
      />
    </div>
  </div>
</template>

<style scoped>
.combobox-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 13rem;
  align-items: center;
  justify-content: center;
}

.combobox-demo__control,
.combobox-demo__stack {
  inline-size: min(100%, 22rem);
}

.combobox-demo__stack {
  display: grid;
  gap: 0.5rem;
}

.combobox-demo__meta {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
}

.combobox-demo__sizes,
.combobox-demo__states {
  display: grid;
  inline-size: min(100%, 46rem);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: end;
}

.combobox-demo__custom-trigger {
  min-inline-size: 12rem;
  justify-content: flex-start;
}

.combobox-demo :deep(.kappa-combobox__item small) {
  color: var(--docs-subtle);
  font-size: 0.6875rem;
  font-weight: 500;
}

@media (max-width: 620px) {
  .combobox-demo {
    min-block-size: 15rem;
  }

  .combobox-demo__sizes,
  .combobox-demo__states {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
