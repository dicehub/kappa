<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
  watch,
} from "vue";
import Loader from "../loader/Loader.vue";
import {
  mapViewErrorMessage,
  mapViewHeight,
  mapViewState,
  type MapViewEmits,
  type MapViewMarker,
  type MapViewMarkerId,
  type MapViewProps,
  type MapViewSlots,
  type MapViewState,
} from "./map-view";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MapViewProps>(), {
  ariaDescription: "Use the arrow keys to pan the map. Use plus and minus to change zoom.",
  controlsLabel: "Map controls",
  empty: false,
  emptyLabel: "No locations available",
  error: undefined,
  height: "28rem",
  loading: false,
  loadingLabel: "Loading map",
  markers: () => [],
  resetLabel: "Reset map view",
  revision: 0,
  selectedMarkerId: undefined,
  showControls: true,
  zoomInLabel: "Zoom in",
  zoomOutLabel: "Zoom out",
});
const emit = defineEmits<MapViewEmits>();
defineSlots<MapViewSlots>();

interface MarkerRecord {
  button: HTMLButtonElement;
  instance: MapLibreMarker;
  marker: MapViewMarker;
}

const container = ref<HTMLDivElement>();
const map = shallowRef<MapLibreMap>();
const internalError = ref<string>();
const descriptionId = `kappa-map-view-${useId()}-description`;
const markerRecords = new globalThis.Map<MapViewMarkerId, MarkerRecord>();
let resizeObserver: ResizeObserver | undefined;
let resizeFrame = 0;
let resetState: MapViewState | undefined;

const visibleError = computed(() => props.error ?? internalError.value);
const canInitialize = computed(() => !props.loading && !props.empty && !props.error);
const rootStyle = computed(() => ({ "--kappa-map-view-height": mapViewHeight(props.height) }));
const controlsDisabled = computed(() => !map.value || props.loading || Boolean(visibleError.value));

const updateSelectedMarkers = () => {
  for (const record of markerRecords.values()) {
    const selected = props.selectedMarkerId !== undefined
      && props.selectedMarkerId === record.marker.id;
    record.button.toggleAttribute("data-selected", selected);
    if (props.selectedMarkerId !== undefined) {
      record.button.setAttribute("aria-pressed", String(selected));
    } else {
      record.button.removeAttribute("aria-pressed");
    }
  }
};

const clearMarkers = () => {
  for (const record of markerRecords.values()) record.instance.remove();
  markerRecords.clear();
};

const createMarkerButton = (marker: MapViewMarker) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "kappa-map-view__marker";
  button.dataset.tone = marker.tone ?? "default";
  button.setAttribute("aria-label", marker.label);

  const shape = document.createElement("span");
  shape.className = "kappa-map-view__marker-shape";
  shape.setAttribute("aria-hidden", "true");
  button.append(shape);
  return button;
};

const createPopupContent = (marker: MapViewMarker) => {
  const content = document.createElement("div");
  content.className = "kappa-map-view__popup-content";

  const label = document.createElement("strong");
  label.className = "kappa-map-view__popup-label";
  label.textContent = marker.label;
  content.append(label);

  if (marker.description) {
    const description = document.createElement("span");
    description.className = "kappa-map-view__popup-description";
    description.textContent = marker.description;
    content.append(description);
  }
  return content;
};

const renderMarkers = () => {
  clearMarkers();
  if (!map.value) return;

  for (const marker of props.markers) {
    markerRecords.get(marker.id)?.instance.remove();
    const button = createMarkerButton(marker);
    const instance = new props.engine.Marker({ anchor: "bottom", element: button })
      .setLngLat([marker.coordinates[0], marker.coordinates[1]]);

    if (marker.popup !== false) {
      const popup = new props.engine.Popup({
        closeButton: true,
        closeOnClick: true,
        focusAfterOpen: true,
        offset: 22,
      }).setDOMContent(createPopupContent(marker));
      instance.setPopup(popup);
    }

    button.addEventListener("click", () => emit("markerClick", marker));
    instance.addTo(map.value);
    markerRecords.set(marker.id, { button, instance, marker });
  }
  updateSelectedMarkers();
};

const handleMoveEnd = () => {
  if (map.value) emit("moveEnd", mapViewState(map.value));
};

const reportError = (error: unknown) => {
  internalError.value = mapViewErrorMessage(error);
  emit("error", error);
};

const dispose = () => {
  clearMarkers();
  if (map.value) {
    map.value.off("moveend", handleMoveEnd);
    map.value.remove();
  }
  map.value = undefined;
  resetState = undefined;
};

const initialize = async () => {
  await nextTick();
  const element = container.value;
  if (!element || !canInitialize.value) return;

  dispose();
  internalError.value = undefined;
  try {
    const instance = new props.engine.Map({ ...props.options, container: element });
    map.value = instance;
    resetState = mapViewState(instance);
    instance.getCanvas().setAttribute("aria-label", props.ariaLabel);
    instance.getCanvas().setAttribute("aria-describedby", descriptionId);
    instance.on("moveend", handleMoveEnd);
    instance.on("error", (event) => emit("error", event.error));
    instance.once("load", () => emit("ready", instance));
    renderMarkers();
  } catch (error) {
    dispose();
    reportError(error);
  }
};

const scheduleResize = () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => map.value?.resize());
};

const zoomIn = () => map.value?.zoomIn();
const zoomOut = () => map.value?.zoomOut();
const reset = () => {
  if (resetState) map.value?.easeTo(resetState);
};
const getMap = () => map.value;
const resize = () => map.value?.resize();

onMounted(() => {
  void initialize();
  if (!container.value) return;
  resizeObserver = new ResizeObserver(scheduleResize);
  resizeObserver.observe(container.value);
});

watch(() => [props.engine, props.options, props.revision], () => void initialize());
watch(() => props.markers, renderMarkers);
watch(() => props.selectedMarkerId, updateSelectedMarkers);
watch(() => props.ariaLabel, (label) => map.value?.getCanvas().setAttribute("aria-label", label));
watch(canInitialize, (ready) => {
  if (ready && !map.value) void initialize();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeFrame);
  resizeObserver?.disconnect();
  dispose();
});

defineExpose({ getMap, reset, resize, zoomIn, zoomOut });
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-map-view"
    data-slot="map-view"
    :data-empty="props.empty || undefined"
    :data-error="visibleError ? '' : undefined"
    :data-loading="props.loading || undefined"
    :style="rootStyle"
    :aria-busy="props.loading || undefined"
  >
    <p :id="descriptionId" class="kappa-map-view__sr-only">{{ props.ariaDescription }}</p>
    <div
      ref="container"
      class="kappa-map-view__canvas"
      data-slot="map-view-canvas"
      :aria-hidden="props.loading || props.empty || Boolean(visibleError) || undefined"
      :inert="props.loading || props.empty || Boolean(visibleError) || undefined"
    />

    <div
      v-if="props.showControls && !props.empty && !visibleError"
      class="kappa-map-view__controls"
      data-slot="map-view-controls"
      role="group"
      :aria-label="props.controlsLabel"
    >
      <button type="button" :aria-label="props.zoomInLabel" :disabled="controlsDisabled" @click="zoomIn">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
      </button>
      <button type="button" :aria-label="props.zoomOutLabel" :disabled="controlsDisabled" @click="zoomOut">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10" /></svg>
      </button>
      <button type="button" :aria-label="props.resetLabel" :disabled="controlsDisabled" @click="reset">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 2.5a5.5 5.5 0 1 1-5.2 3.7M2.5 2.5v4h4" />
        </svg>
      </button>
    </div>

    <div v-if="$slots.overlay" class="kappa-map-view__overlay" data-slot="map-view-overlay">
      <slot name="overlay" :map="map" />
    </div>

    <div v-if="props.loading" class="kappa-map-view__state" data-slot="map-view-loading">
      <slot name="loading"><Loader size="sm" :label="props.loadingLabel" variant="spinner" /></slot>
    </div>
    <div v-else-if="visibleError" class="kappa-map-view__state" data-slot="map-view-error" role="alert">
      <slot name="error" :error="visibleError">{{ visibleError }}</slot>
    </div>
    <div v-else-if="props.empty" class="kappa-map-view__state" data-slot="map-view-empty">
      <slot name="empty">{{ props.emptyLabel }}</slot>
    </div>
  </div>
</template>

<style src="./map-view.css"></style>
