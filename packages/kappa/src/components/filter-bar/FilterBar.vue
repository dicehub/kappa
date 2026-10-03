<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "../button";
import { Dropdown } from "../dropdown";
import { Input } from "../input";
import { ToggleGroup } from "../toggle-group";
import {
  FILTER_BAR_DEFAULT_LABELS,
  type FilterBarEmits,
  type FilterBarProps,
  type FilterBarSlots,
  type FilterBarSortDirection,
  type FilterBarView,
} from "./filter-bar";

const props = withDefaults(defineProps<FilterBarProps>(), {
  showSearch: true,
  showView: false,
  disabled: false,
  sortOptions: () => [],
});
const emit = defineEmits<FilterBarEmits>();
const slots = defineSlots<FilterBarSlots>();

const internalQuery = ref(props.defaultValue ?? "");
const internalSortBy = ref(props.defaultSortBy);
const internalDirection = ref<FilterBarSortDirection>(props.defaultSortDirection ?? "desc");
const internalView = ref<FilterBarView>(props.defaultView ?? "list");
const labels = computed(() => ({ ...FILTER_BAR_DEFAULT_LABELS, ...props.labels }));
const query = computed(() => props.modelValue ?? internalQuery.value);
const sortBy = computed(() => props.sortBy ?? internalSortBy.value ?? props.sortOptions.find(option => !option.disabled)?.value ?? "");
const direction = computed(() => props.sortDirection ?? internalDirection.value);
const view = computed(() => props.view ?? internalView.value);
const sortLabel = computed(() => props.sortOptions.find(option => option.value === sortBy.value)?.label ?? sortBy.value);
const directionLabel = computed(() => direction.value === "desc" ? labels.value.ascending : labels.value.descending);

function updateQuery(value: string) {
  if (props.disabled) return;
  if (props.modelValue === undefined) internalQuery.value = value;
  emit("update:modelValue", value);
}

function updateSortBy(value: string) {
  if (props.disabled || !props.sortOptions.some(option => option.value === value && !option.disabled)) return;
  if (props.sortBy === undefined) internalSortBy.value = value;
  emit("update:sortBy", value);
}

function toggleDirection() {
  if (props.disabled) return;
  const value = direction.value === "desc" ? "asc" : "desc";
  if (props.sortDirection === undefined) internalDirection.value = value;
  emit("update:sortDirection", value);
}

function updateView(values: string[]) {
  const value = values[0];
  if (props.disabled || (value !== "list" && value !== "grid")) return;
  if (props.view === undefined) internalView.value = value;
  emit("update:view", value);
}
</script>

<template>
  <div class="kappa-filter-bar" data-slot="filter-bar" role="group" :aria-label="labels.root" :data-disabled="props.disabled ? '' : undefined">
    <div v-if="props.showSearch" class="kappa-filter-bar__search" data-slot="filter-bar-search">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="4" /><path d="m10 10 3 3" />
      </svg>
      <Input :model-value="query" type="search" size="sm" :disabled="props.disabled" :aria-label="labels.search" :placeholder="labels.searchPlaceholder" @update:model-value="updateQuery" />
    </div>

    <div v-if="props.sortOptions.length" class="kappa-filter-bar__sort" data-slot="filter-bar-sort">
      <Dropdown.Root :aria-label="labels.sort" :positioning="{ placement: 'bottom-start' }">
        <Dropdown.Trigger as-child>
          <Button variant="outline" size="sm" :disabled="props.disabled" :aria-label="`${labels.sort}: ${sortLabel}`" class="kappa-filter-bar__sort-trigger">
            <span>{{ sortLabel || labels.sort }}</span><Dropdown.Indicator />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup :model-value="sortBy" @update:model-value="updateSortBy">
            <Dropdown.Label>{{ labels.sort }}</Dropdown.Label>
            <Dropdown.RadioItem v-for="option in props.sortOptions" :key="option.value" :value="option.value" :disabled="props.disabled || option.disabled" close-on-select>
              {{ option.label }}
            </Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Root>
      <Button variant="outline" size="sm" shape="square" :disabled="props.disabled" :aria-label="directionLabel" :title="directionLabel" data-slot="filter-bar-sort-direction" @click="toggleDirection">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2.5 4h7M2.5 8h5M2.5 12h3" />
          <path v-if="direction === 'desc'" d="M12 3v10m-2-2 2 2 2-2" />
          <path v-else d="M12 13V3m-2 2 2-2 2 2" />
        </svg>
      </Button>
    </div>

    <div v-if="slots.filters" class="kappa-filter-bar__filters" data-slot="filter-bar-filters">
      <slot name="filters" :disabled="props.disabled" />
    </div>

    <div v-if="props.showView || slots.actions" class="kappa-filter-bar__actions" data-slot="filter-bar-actions">
      <ToggleGroup.Root v-if="props.showView" :model-value="[view]" :disabled="props.disabled" :deselectable="false" :aria-label="labels.view" size="sm" spacing="none" variant="outline" class="kappa-filter-bar__view" @update:model-value="updateView">
        <ToggleGroup.Item value="list" :aria-label="labels.list" :title="labels.list">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01" /></svg>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="grid" :aria-label="labels.grid" :title="labels.grid">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="4" height="4" rx=".5" /><rect x="9.5" y="2.5" width="4" height="4" rx=".5" /><rect x="2.5" y="9.5" width="4" height="4" rx=".5" /><rect x="9.5" y="9.5" width="4" height="4" rx=".5" /></svg>
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <slot name="actions" :disabled="props.disabled" />
    </div>
  </div>
</template>

<style src="./filter-bar.css"></style>
