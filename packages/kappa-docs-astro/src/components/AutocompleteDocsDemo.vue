<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Autocomplete,
  createAutocompleteCollection,
} from "@dicehub/kappa/components/autocomplete";

type DemoVariant =
  | "preview"
  | "usage"
  | "controlled"
  | "field"
  | "invalid"
  | "grouped"
  | "sizes"
  | "filtering"
  | "states";

type AutocompleteSize = "xs" | "sm" | "base" | "lg";

type Option = {
  disabled?: boolean;
  group?: string;
  label: string;
  value: string;
};

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const commands: Option[] = [
  { label: "Run simulation", value: "run" },
  { label: "Review mesh", value: "mesh" },
  { label: "Restart worker", value: "restart", disabled: true },
  { label: "Open results", value: "results" },
];

const fruits: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Apricot", value: "apricot" },
  { label: "Avocado", value: "avocado" },
  { label: "Banana", value: "banana" },
  { label: "Blackberry", value: "blackberry" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Cherry", value: "cherry" },
  { label: "Pear", value: "pear" },
];

const countries: Option[] = [
  { label: "Australia", value: "au" },
  { label: "Canada", value: "ca" },
  { label: "France", value: "fr" },
  { label: "Germany", value: "de" },
  { label: "Japan", value: "jp" },
  { label: "South Korea", value: "kr" },
  { label: "United Kingdom", value: "gb" },
  { label: "United States", value: "us" },
];

const regions: Option[] = [
  { label: "US East (Virginia)", value: "us-east-1", group: "North America" },
  { label: "US West (Oregon)", value: "us-west-2", group: "North America" },
  { label: "EU West (Ireland)", value: "eu-west-1", group: "Europe" },
  { label: "EU Central (Frankfurt)", value: "eu-central-1", group: "Europe" },
  { label: "AP Southeast (Singapore)", value: "ap-southeast-1", group: "Asia Pacific" },
  { label: "AP Northeast (Tokyo)", value: "ap-northeast-1", group: "Asia Pacific" },
];

const projects: Option[] = [
  { label: "Aerofoil study", value: "aerofoil" },
  { label: "Cavity benchmark", value: "cavity" },
  { label: "Cylinder wake", value: "cylinder" },
  { label: "Dam break", value: "dam-break" },
];

const collectionOptions = {
  itemToString: (item: Option) => item.label,
  itemToValue: (item: Option) => item.value,
};

const controlledInput = ref("");
const regionQuery = ref("");
const sizes: AutocompleteSize[] = ["xs", "sm", "base", "lg"];
const isItemDisabled = (item: Option) => item.disabled === true;
const startsWith = (item: Option, query: string) =>
  item.label.toLowerCase().startsWith(query.trim().toLowerCase());

const regionCollection = computed(() =>
  createAutocompleteCollection({
    items: regionQuery.value.trim()
      ? regions.filter((item) =>
          item.label.toLowerCase().includes(regionQuery.value.trim().toLowerCase()),
        )
      : [],
    groupBy: (item: Option) => item.group ?? "Other",
    ...collectionOptions,
  }),
);
</script>

<template>
  <div class="autocomplete-demo" :data-autocomplete-demo="variant">
    <Autocomplete
      v-if="variant === 'preview'"
      id="autocomplete-preview"
      class="autocomplete-demo__control"
      :items="commands"
      :input-attrs="{ 'aria-label': 'Find a command' }"
      :is-item-disabled="isItemDisabled"
      clearable
      empty-text="No matching command."
      input-behavior="autohighlight"
      placeholder="Find a command..."
    />

    <Autocomplete
      v-else-if="variant === 'usage'"
      id="autocomplete-usage"
      class="autocomplete-demo__control"
      :items="commands"
    >
      <Autocomplete.InputGroup placeholder="Find a command..." aria-label="Find a command" />
      <Autocomplete.Content teleport-to="body">
        <Autocomplete.Empty>No matching command.</Autocomplete.Empty>
        <Autocomplete.List>
          <template #default="{ item }">
            <Autocomplete.Item :item="item">
              {{ (item as Option).label }}
            </Autocomplete.Item>
          </template>
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>

    <div v-else-if="variant === 'controlled'" class="autocomplete-demo__stack">
      <Autocomplete
        id="autocomplete-controlled"
        v-model:input-value="controlledInput"
        class="autocomplete-demo__control"
        :items="fruits"
        :input-attrs="{ 'aria-label': 'Type a fruit' }"
        clearable
        empty-text="No matching fruit."
        placeholder="Type a fruit..."
      />
      <p class="autocomplete-demo__meta">
        Input: <strong>{{ controlledInput || "empty" }}</strong>
      </p>
    </div>

    <div v-else-if="variant === 'field'" class="autocomplete-demo__stack">
      <Autocomplete
        id="autocomplete-field"
        class="autocomplete-demo__control"
        :items="countries"
        :input-attrs="{ 'aria-describedby': 'autocomplete-country-help' }"
        empty-text="No countries found."
        label="Country"
        placeholder="Search countries..."
      />
      <p id="autocomplete-country-help" class="autocomplete-demo__meta">
        Start typing to filter countries.
      </p>
    </div>

    <div v-else-if="variant === 'invalid'" class="autocomplete-demo__stack">
      <Autocomplete
        id="autocomplete-invalid"
        class="autocomplete-demo__control"
        :items="countries"
        :input-attrs="{ 'aria-describedby': 'autocomplete-country-error' }"
        empty-text="No countries found."
        invalid
        label="Country"
        placeholder="Search countries..."
      />
      <p id="autocomplete-country-error" class="autocomplete-demo__error">
        Please enter a supported country.
      </p>
    </div>

    <Autocomplete
      v-else-if="variant === 'grouped'"
      id="autocomplete-grouped"
      v-model:input-value="regionQuery"
      class="autocomplete-demo__control"
      :collection="regionCollection"
    >
      <Autocomplete.InputGroup placeholder="Find a region..." aria-label="Find a region" />
      <Autocomplete.Content>
        <Autocomplete.Empty>No matching region.</Autocomplete.Empty>
        <Autocomplete.List :render-items="false">
          <Autocomplete.Group
            v-for="[group, groupItems] in regionCollection.group()"
            :key="group"
          >
            <Autocomplete.GroupLabel>{{ group }}</Autocomplete.GroupLabel>
            <Autocomplete.Item
              v-for="region in groupItems"
              :key="region.value"
              :item="region"
            >
              {{ region.label }}
            </Autocomplete.Item>
          </Autocomplete.Group>
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete>

    <div v-else-if="variant === 'sizes'" class="autocomplete-demo__sizes">
      <Autocomplete
        v-for="size in sizes"
        :id="`autocomplete-size-${size}`"
        :key="size"
        class="autocomplete-demo__size-control"
        :items="fruits"
        :size="size"
        :placeholder="size === 'base' ? 'base (default)' : size"
        :input-attrs="{ 'aria-label': `${size} autocomplete` }"
        show-on-empty
      />
    </div>

    <Autocomplete
      v-else-if="variant === 'filtering'"
      id="autocomplete-filtering"
      class="autocomplete-demo__control"
      :items="projects"
      :filter="startsWith"
      :input-attrs="{ 'aria-label': 'Filter projects' }"
      empty-text="No project starts with that text."
      placeholder="Filter projects..."
      show-on-empty
      show-trigger
    />

    <div v-else class="autocomplete-demo__states">
      <Autocomplete
        id="autocomplete-disabled"
        class="autocomplete-demo__state-control"
        :items="fruits"
        disabled
        label="Disabled"
        placeholder="Unavailable"
      />
      <Autocomplete
        id="autocomplete-read-only"
        class="autocomplete-demo__state-control"
        :items="fruits"
        :default-value="['apple']"
        label="Read only"
        read-only
      />
    </div>
  </div>
</template>

<style scoped>
.autocomplete-demo {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 12rem;
  align-items: center;
  justify-content: center;
}

.autocomplete-demo__control,
.autocomplete-demo__stack {
  width: min(100%, 21rem);
}

.autocomplete-demo__stack {
  display: grid;
  gap: 0.45rem;
}

.autocomplete-demo__meta,
.autocomplete-demo__error {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.8125rem;
  line-height: 1.45;
}

.autocomplete-demo__meta strong {
  color: var(--docs-default);
  font-weight: 600;
}

.autocomplete-demo__error {
  color: var(--docs-danger, #b42318);
}

.autocomplete-demo__sizes,
.autocomplete-demo__states {
  display: grid;
  width: min(100%, 44rem);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: end;
}

.autocomplete-demo__size-control,
.autocomplete-demo__state-control {
  width: 100%;
  min-width: 0;
}

@media (max-width: 620px) {
  .autocomplete-demo {
    min-height: 14rem;
  }

  .autocomplete-demo__sizes,
  .autocomplete-demo__states {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
