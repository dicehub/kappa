<script setup lang="ts">
import { computed, ref } from "vue";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapView, type MapViewMarker } from "@dicehub/kappa/components/map-view";
import type { Map as MapLibreMap, MapOptions } from "maplibre-gl";
import { maplibre } from "../lib/maplibre";
import MapAddressSearchDocsDemo from "./MapAddressSearchDocsDemo.vue";

const props = withDefaults(defineProps<{
  standalone?: boolean;
  variant?: "preview" | "search" | "markers" | "geometry" | "states";
}>(), {
  standalone: false,
  variant: "preview",
});

const selectedMarkerId = ref<string | number>();

const markers: readonly MapViewMarker[] = [
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
  {
    id: "dresden",
    coordinates: [13.7373, 51.0504],
    label: "Dresden",
    description: "Research partner",
    tone: "warning",
  },
];

const previewMarkers = computed(() => props.variant === "preview" ? markers.slice(0, 2) : markers);
const selectedMarker = computed(() => markers.find((marker) => marker.id === selectedMarkerId.value));

const options: Omit<MapOptions, "container"> = {
  attributionControl: { compact: true },
  center: [12.1, 52.45],
  maplibreLogo: false,
  maxZoom: 18,
  style: "https://tiles.openfreemap.org/styles/liberty",
  zoom: 5.6,
};

const geometryOptions: Omit<MapOptions, "container"> = {
  ...options,
  center: [11.85, 52.35],
  zoom: 5.35,
};

const addGeometry = (map: MapLibreMap) => {
  if (map.getSource("operations")) return;

  map.addSource("operations", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { kind: "area" },
          geometry: {
            type: "Polygon",
            coordinates: [[[8.35, 54.05], [10.45, 54.55], [14.55, 52.25], [12.7, 50.65], [9.15, 51.2], [8.35, 54.05]]],
          },
        },
        {
          type: "Feature",
          properties: { kind: "route" },
          geometry: {
            type: "LineString",
            coordinates: [markers[1].coordinates, markers[0].coordinates, markers[2].coordinates],
          },
        },
      ],
    },
  });
  map.addLayer({
    id: "operations-area",
    type: "fill",
    source: "operations",
    filter: ["==", ["get", "kind"], "area"],
    paint: { "fill-color": "#247ab7", "fill-opacity": 0.12 },
  });
  map.addLayer({
    id: "operations-route",
    type: "line",
    source: "operations",
    filter: ["==", ["get", "kind"], "route"],
    paint: { "line-color": "#247ab7", "line-dasharray": [2, 1.5], "line-width": 3 },
  });
};

</script>

<template>
  <MapAddressSearchDocsDemo
    v-if="props.variant === 'search'"
    :standalone="props.standalone"
  />

  <div v-else-if="props.variant === 'states'" class="maps-demo maps-demo--states">
    <MapView :engine="maplibre" :options="options" aria-label="Loading map example" :height="190" loading />
    <MapView :engine="maplibre" :options="options" aria-label="Empty map example" :height="190" empty />
    <MapView
      :engine="maplibre"
      :options="options"
      aria-label="Map error example"
      :height="190"
      error="The location service is unavailable."
    />
  </div>

  <MapView
    v-else-if="props.variant === 'geometry'"
    :engine="maplibre"
    :options="geometryOptions"
    aria-label="Operations area and route across Germany"
    aria-description="A service area, route, and three labeled locations across Germany."
    :markers="markers"
    @ready="addGeometry"
  >
    <template #overlay>
      <div class="maps-demo__summary">
        <span class="maps-demo__eyebrow">Operations network</span>
        <strong>3 connected locations</strong>
      </div>
    </template>
  </MapView>

  <MapView
    v-else
    :engine="maplibre"
    :options="options"
    aria-label="Engineering locations in Germany"
    aria-description="Engineering locations in Berlin, Hamburg, and Dresden. Select a marker for details."
    :height="props.variant === 'preview' ? 390 : 440"
    :markers="previewMarkers"
    :selected-marker-id="selectedMarkerId"
    @marker-click="selectedMarkerId = $event.id"
  >
    <template #overlay>
      <div class="maps-demo__summary">
        <span class="maps-demo__eyebrow">{{ selectedMarker ? "Selected location" : "Network" }}</span>
        <strong>{{ selectedMarker?.label ?? `${previewMarkers.length} active locations` }}</strong>
        <span v-if="selectedMarker">{{ selectedMarker.description }}</span>
      </div>
    </template>
  </MapView>
</template>

<style scoped>
.maps-demo--states {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  inline-size: 100%;
}

.maps-demo__summary {
  display: grid;
  min-inline-size: 10.5rem;
  gap: 0.12rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid color-mix(in srgb, var(--kappa-line-strong) 72%, transparent);
  border-radius: var(--kappa-radius-md);
  background: color-mix(in srgb, var(--kappa-control) 94%, transparent);
  box-shadow: var(--kappa-shadow-sm);
  color: var(--kappa-default);
  backdrop-filter: blur(8px);
}

.maps-demo__summary strong {
  font-size: 0.875rem;
  line-height: 1.35;
}

.maps-demo__summary > span:last-child:not(.maps-demo__eyebrow) {
  color: var(--kappa-muted);
  font-size: 0.75rem;
}

.maps-demo__eyebrow {
  color: var(--kappa-muted);
  font-size: 0.625rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
}

@media (max-width: 760px) {
  .maps-demo--states {
    grid-template-columns: 1fr;
  }
}
</style>
