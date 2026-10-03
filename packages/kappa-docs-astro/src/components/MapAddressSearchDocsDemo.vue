<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Autocomplete,
  type AutocompleteInputValueChangeDetails,
  type AutocompleteValueChangeDetails,
} from "@dicehub/kappa/components/autocomplete";
import { MapView, type MapViewMarker } from "@dicehub/kappa/components/map-view";
import type { Map as MapLibreMap, MapOptions } from "maplibre-gl";
import { maplibre } from "../lib/maplibre";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), {
  standalone: false,
});

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    city?: string;
    country?: string;
    extent?: [number, number, number, number];
    housenumber?: string;
    name?: string;
    osm_id?: number;
    osm_type?: string;
    postcode?: string;
    street?: string;
  };
}

interface SearchResult extends MapViewMarker {
  extent?: [number, number, number, number];
}

const options: Omit<MapOptions, "container"> = {
  attributionControl: { compact: true },
  center: [12.1, 52.45],
  maplibreLogo: false,
  maxZoom: 18,
  style: "https://tiles.openfreemap.org/styles/liberty",
  zoom: 5.6,
};

const query = ref("");
const searchResults = ref<SearchResult[]>([]);
const searchError = ref("");
const searching = ref(false);
const searchComplete = ref(false);
const searchOpen = ref(false);
const selectedMarkerId = ref<string | number>();
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let searchController: AbortController | undefined;

const searchMarkers = computed(() =>
  searchResults.value.filter((result) => result.id === selectedMarkerId.value),
);
const emptyText = computed(() => {
  if (query.value.trim().length < 3) return "Type at least 3 characters.";
  if (searching.value) return "Searching addresses...";
  if (searchError.value) return searchError.value;
  if (searchComplete.value) return "No locations found.";
  return "Searching addresses...";
});

const photonResult = (feature: PhotonFeature, index: number): SearchResult | undefined => {
  const coordinates = feature.geometry?.coordinates;
  if (!coordinates || coordinates.length < 2) return;

  const properties = feature.properties ?? {};
  const address = [properties.street, properties.housenumber].filter(Boolean).join(" ");
  const label = properties.name || address || properties.city || properties.country || "Unnamed location";
  const description = [
    address !== label ? address : undefined,
    [properties.postcode, properties.city].filter(Boolean).join(" "),
    properties.country,
  ].filter((part, partIndex, parts) => part && part !== label && parts.indexOf(part) === partIndex).join(" · ");

  return {
    id: properties.osm_id ? `${properties.osm_type ?? "osm"}-${properties.osm_id}` : `result-${index}`,
    coordinates,
    description: description || undefined,
    extent: properties.extent,
    label,
    tone: "accent",
  };
};

const searchAddresses = async (value = query.value) => {
  const normalized = value.trim();
  if (normalized.length < 3) return;

  searchController?.abort();
  const controller = new AbortController();
  searchController = controller;
  searchComplete.value = false;
  searchError.value = "";
  searching.value = true;

  try {
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", normalized);
    url.searchParams.set("limit", "5");
    url.searchParams.set("lang", "en");
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Address search returned ${response.status}`);
    const data = await response.json() as { features?: PhotonFeature[] };
    searchResults.value = (data.features ?? [])
      .map(photonResult)
      .filter((result): result is SearchResult => Boolean(result));
    searchComplete.value = true;
  } catch {
    if (controller.signal.aborted) return;
    searchResults.value = [];
    searchError.value = "Address search is unavailable. Try again.";
  } finally {
    if (searchController === controller) searching.value = false;
  }
};

const scheduleSearch = (details: AutocompleteInputValueChangeDetails) => {
  query.value = details.inputValue;
  if (details.reason === "item-select") return;

  searchOpen.value = details.inputValue.trim().length > 0;

  if (debounceTimer) clearTimeout(debounceTimer);
  searchController?.abort();
  searchResults.value = [];
  searchComplete.value = false;
  searchError.value = "";
  searching.value = false;
  if (details.inputValue.trim().length < 3) return;

  searching.value = true;
  debounceTimer = setTimeout(() => void searchAddresses(details.inputValue), 320);
};

const submitSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  searchOpen.value = query.value.trim().length > 0;
  void searchAddresses();
};

const selectSearchResult = (map: MapLibreMap | undefined, result: SearchResult) => {
  selectedMarkerId.value = result.id;
  if (!map) return;

  if (result.extent) {
    const [west, north, east, south] = result.extent;
    map.fitBounds([[west, south], [east, north]], { duration: 700, maxZoom: 16, padding: 56 });
  } else {
    map.flyTo({ center: [...result.coordinates], duration: 700, essential: true, zoom: 13 });
  }
};

const selectSuggestion = (
  map: MapLibreMap | undefined,
  details: AutocompleteValueChangeDetails<SearchResult>,
) => {
  const result = details.items[0];
  if (result) {
    searchOpen.value = false;
    selectSearchResult(map, result);
  }
};

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  searchController?.abort();
});
</script>

<template>
  <MapView
    :engine="maplibre"
    :options="options"
    aria-label="Address search map"
    aria-description="Search for an address and select a suggestion to move the map."
    :height="props.standalone ? '100dvh' : 448"
    :markers="searchMarkers"
    :selected-marker-id="selectedMarkerId"
    @marker-click="selectedMarkerId = $event.id"
  >
    <template #overlay="{ map }">
      <form class="maps-address-search" role="search" @submit.prevent="submitSearch">
        <Autocomplete
          v-model:open="searchOpen"
          class="maps-address-search__autocomplete"
          :filter="false"
          :input-attrs="{ 'aria-label': 'Find an address', autocomplete: 'street-address' }"
          input-behavior="autohighlight"
          :item-to-string="(result: SearchResult) => result.label"
          :item-to-value="(result: SearchResult) => String(result.id)"
          :items="searchResults"
          placeholder="Find an address..."
          selection-behavior="replace"
          clearable
          @input-value-change="scheduleSearch"
          @value-change="selectSuggestion(map, $event)"
        >
          <Autocomplete.InputGroup
            :input-attrs="{ 'aria-label': 'Find an address', autocomplete: 'street-address' }"
            placeholder="Find an address..."
            clearable
          />
          <Autocomplete.Content class="maps-address-search__suggestions">
            <Autocomplete.Empty>{{ emptyText }}</Autocomplete.Empty>
            <Autocomplete.List>
              <template #default="{ item }">
                <Autocomplete.Item :item="item" class="maps-address-search__suggestion">
                  <span class="maps-address-search__suggestion-copy">
                    <strong>{{ (item as SearchResult).label }}</strong>
                    <span v-if="(item as SearchResult).description">
                      {{ (item as SearchResult).description }}
                    </span>
                  </span>
                  <template #indicator><span /></template>
                </Autocomplete.Item>
              </template>
            </Autocomplete.List>
            <a
              class="maps-address-search__credit"
              href="https://photon.komoot.io"
              target="_blank"
              rel="noreferrer"
            >Search by Photon</a>
          </Autocomplete.Content>
        </Autocomplete>
        <button type="submit" :disabled="searching || query.trim().length < 3">
          {{ searching ? "Searching..." : "Search" }}
        </button>
      </form>
    </template>
  </MapView>
</template>

<style scoped>
.maps-address-search {
  display: flex;
  inline-size: min(25rem, calc(100vw - 8rem));
  gap: 0.35rem;
}

.maps-address-search__autocomplete {
  min-inline-size: 0;
  flex: 1;
}

.maps-address-search__autocomplete :deep(.kappa-autocomplete__control) {
  background: color-mix(in srgb, var(--kappa-control) 96%, transparent);
  box-shadow: var(--kappa-shadow-sm);
  backdrop-filter: blur(8px);
}

.maps-address-search > button {
  min-inline-size: 4.75rem;
  padding-inline: 0.8rem;
  border: 1px solid var(--kappa-accent-solid);
  border-radius: var(--kappa-radius-md);
  background: var(--kappa-accent-solid);
  color: var(--kappa-accent-contrast);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.maps-address-search > button:hover:not(:disabled) {
  background: color-mix(in srgb, var(--kappa-accent-solid) 88%, black);
}

.maps-address-search > button:focus-visible {
  outline: 2px solid var(--kappa-focus);
  outline-offset: 2px;
}

.maps-address-search > button:disabled {
  cursor: not-allowed;
  opacity: var(--kappa-disabled-opacity);
}

:global(.maps-address-search__suggestions) {
  padding-block-end: 0;
}

:global(.maps-address-search__suggestion-copy) {
  display: grid;
  min-inline-size: 0;
  gap: 0.1rem;
}

:global(.maps-address-search__suggestion-copy strong) {
  overflow: hidden;
  font-size: 0.8125rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.maps-address-search__suggestion-copy > span) {
  overflow: hidden;
  color: var(--kappa-muted);
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.maps-address-search__credit) {
  display: block;
  margin-inline: -0.375rem;
  padding: 0.4rem 0.7rem;
  border-block-start: 1px solid var(--kappa-line);
  color: var(--kappa-muted);
  font-size: 0.6875rem;
  text-align: end;
  text-decoration: none;
}

:global(.maps-address-search__credit:hover) {
  color: var(--kappa-default);
  text-decoration: underline;
}

@media (max-width: 560px) {
  .maps-address-search {
    inline-size: calc(100vw - 5rem);
  }

  .maps-address-search > button {
    display: none;
  }
}
</style>
