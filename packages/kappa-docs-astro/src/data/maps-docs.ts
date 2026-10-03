export const installCode = `pnpm add @dicehub/kappa maplibre-gl`;

export const basicCode = `<script setup lang="ts">
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapView } from "@dicehub/kappa/components/map-view";
import type { MapOptions } from "maplibre-gl";

const options = {
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [13.405, 52.52],
  zoom: 10,
} satisfies Omit<MapOptions, "container">;
</script>

<template>
  <MapView
    :engine="maplibre"
    :options="options"
    aria-label="Map of Berlin"
  />
</template>`;

export const searchCode = `<script setup lang="ts">
import { computed, ref } from "vue";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Autocomplete,
  type AutocompleteInputValueChangeDetails,
  type AutocompleteValueChangeDetails,
} from "@dicehub/kappa/components/autocomplete";
import { MapView, type MapViewMarker } from "@dicehub/kappa/components/map-view";
import type { Map as MapLibreMap, MapOptions } from "maplibre-gl";

interface AddressResult extends MapViewMarker {
  id: string;
}

const query = ref("");
const results = ref<AddressResult[]>([]);
const selected = ref<AddressResult>();
const searchOpen = ref(false);
const markers = computed(() => selected.value ? [selected.value] : []);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;
let searchController: AbortController | undefined;
const options = {
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [12.1, 52.45],
  zoom: 5.6,
} satisfies Omit<MapOptions, "container">;

async function searchAddresses(value: string) {
  searchController?.abort();
  const controller = new AbortController();
  searchController = controller;
  try {
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", value);
    url.searchParams.set("limit", "5");
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Address search returned " + response.status);
    const data = await response.json() as {
      features: Array<{
        geometry: { coordinates: [number, number] };
        properties: { name?: string; city?: string; osm_id?: number };
      }>;
    };
    results.value = data.features.map((feature, index) => ({
      id: String(feature.properties.osm_id ?? index),
      label: feature.properties.name ?? feature.properties.city ?? "Unnamed location",
      coordinates: feature.geometry.coordinates,
    }));
  } catch {
    if (!controller.signal.aborted) results.value = [];
  }
}

function suggestAddresses(details: AutocompleteInputValueChangeDetails) {
  query.value = details.inputValue;
  if (details.reason === "item-select") return;
  searchOpen.value = details.inputValue.trim().length > 0;
  if (debounceTimer) clearTimeout(debounceTimer);
  searchController?.abort();
  results.value = [];
  if (details.inputValue.trim().length < 3) return;
  debounceTimer = setTimeout(() => searchAddresses(details.inputValue), 320);
}

function selectAddress(
  map: MapLibreMap,
  details: AutocompleteValueChangeDetails<AddressResult>,
) {
  selected.value = details.items[0];
  if (selected.value) {
    searchOpen.value = false;
    map.flyTo({ center: selected.value.coordinates, zoom: 13 });
  }
}
</script>

<template>
  <MapView
    :engine="maplibre"
    :options="options"
    :markers="markers"
    aria-label="Address search map"
  >
    <template #overlay="{ map }">
      <Autocomplete
        v-model:input-value="query"
        v-model:open="searchOpen"
        :filter="false"
        :input-attrs="{ 'aria-label': 'Find an address' }"
        :items="results"
        :item-to-string="(item: AddressResult) => item.label"
        :item-to-value="(item: AddressResult) => item.id"
        input-behavior="autohighlight"
        placeholder="Find an address..."
        @input-value-change="suggestAddresses"
        @value-change="selectAddress(map, $event)"
      />
    </template>
  </MapView>
</template>`;

export const markersCode = `<script setup lang="ts">
import { ref } from "vue";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  MapView,
  type MapViewMarker,
} from "@dicehub/kappa/components/map-view";
import type { MapOptions } from "maplibre-gl";

const selectedId = ref<string | number>();
const options = {
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [12.1, 52.45],
  zoom: 5.6,
} satisfies Omit<MapOptions, "container">;
const markers: MapViewMarker[] = [
  {
    id: "berlin",
    coordinates: [13.405, 52.52],
    label: "Berlin",
    description: "Primary engineering office",
    tone: "accent",
  },
  {
    id: "hamburg",
    coordinates: [9.9937, 53.5511],
    label: "Hamburg",
    description: "Test facility",
    tone: "success",
  },
];
</script>

<template>
  <MapView
    :engine="maplibre"
    :options="options"
    :markers="markers"
    :selected-marker-id="selectedId"
    aria-label="Engineering locations"
    @marker-click="selectedId = $event.id"
  />
</template>`;

export const geometryCode = `<script setup lang="ts">
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapView } from "@dicehub/kappa/components/map-view";
import type { Map as MapLibreMap, MapOptions } from "maplibre-gl";

const options = {
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [11.85, 52.35],
  zoom: 5.35,
} satisfies Omit<MapOptions, "container">;

const operationsGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [[
          [8.35, 54.05], [10.45, 54.55],
          [14.55, 52.25], [12.7, 50.65],
          [9.15, 51.2], [8.35, 54.05],
        ]],
      },
    },
  ],
} satisfies Parameters<MapLibreMap["addSource"]>[1];

function addOperationsLayer(map: MapLibreMap) {
  map.addSource("operations", {
    type: "geojson",
    data: operationsGeoJson,
  });
  map.addLayer({
    id: "operations-area",
    type: "fill",
    source: "operations",
    paint: {
      "fill-color": "#247ab7",
      "fill-opacity": 0.12,
    },
  });
}
</script>

<template>
  <MapView
    :engine="maplibre"
    :options="options"
    aria-label="Operations area and route"
    @ready="addOperationsLayer"
  />
</template>`;

export const statesCode = `<script setup lang="ts">
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapView } from "@dicehub/kappa/components/map-view";
import type { MapOptions } from "maplibre-gl";

const options = {
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [13.405, 52.52],
  zoom: 10,
} satisfies Omit<MapOptions, "container">;
</script>

<template>
  <MapView :engine="maplibre" :options="options" aria-label="Map" loading />
  <MapView :engine="maplibre" :options="options" aria-label="Map" empty />
  <MapView
    :engine="maplibre"
    :options="options"
    aria-label="Map"
    error="The location service is unavailable."
  />
</template>`;

export const mapViewProps = [
  { name: "ariaLabel", type: "string", defaultValue: "—", description: "Required accessible name for the interactive map canvas." },
  { name: "ariaDescription", type: "string", defaultValue: "Keyboard instructions", description: "Instructions or a short data summary linked to the canvas." },
  { name: "engine", type: "MapViewEngine", defaultValue: "—", description: "Imported MapLibre namespace. Keeps the engine outside the Kappa bundle." },
  { name: "options", type: "MapViewOptions", defaultValue: "—", description: "MapLibre initialization options except container." },
  { name: "markers", type: "readonly MapViewMarker[]", defaultValue: "[]", description: "Safe text markers with optional descriptions, tones, and popups." },
  { name: "selectedMarkerId", type: "string | number", defaultValue: "—", description: "Marks one location as selected without owning application state." },
  { name: "height", type: "string | number", defaultValue: '"28rem"', description: "Map height. Numbers are pixels." },
  { name: "showControls", type: "boolean", defaultValue: "true", description: "Shows Kappa zoom and reset controls." },
  { name: "loading / empty / error", type: "boolean / boolean / string", defaultValue: "false / false / —", description: "Explicit asynchronous and data states." },
  { name: "revision", type: "number | string", defaultValue: "0", description: "Recreates the map after in-place option changes." },
] as const;

export const mapViewEvents = [
  { name: "ready", payload: "MapLibreMap", description: "Fires after the map style loads. Add custom sources and layers here." },
  { name: "markerClick", payload: "MapViewMarker", description: "Fires when a Kappa marker is selected." },
  { name: "moveEnd", payload: "MapViewState", description: "Returns center, zoom, bearing, and pitch after movement." },
  { name: "error", payload: "unknown", description: "Reports construction and MapLibre runtime errors." },
] as const;

export const mapViewMethods = [
  { name: "getMap()", description: "Returns the MapLibre map instance for advanced engine operations." },
  { name: "resize()", description: "Recalculates the canvas size. ResizeObserver calls this automatically." },
  { name: "reset()", description: "Returns to the initial camera position." },
  { name: "zoomIn() / zoomOut()", description: "Changes zoom with the engine animation." },
] as const;
