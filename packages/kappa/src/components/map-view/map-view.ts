/// <reference types="geojson" preserve="true" />

import type {
  Map as MapLibreMap,
  MapOptions,
  Marker as MapLibreMarker,
  MarkerOptions,
  Popup as MapLibrePopup,
  PopupOptions,
} from "maplibre-gl";
import type { VNodeChild } from "vue";

export type MapViewMarkerId = string | number;
export type MapViewMarkerTone = "default" | "accent" | "success" | "warning" | "danger";
export type MapViewCoordinates = readonly [longitude: number, latitude: number];
export type MapViewOptions = Omit<MapOptions, "container">;

/** The small MapLibre surface used by MapView. Pass the imported MapLibre namespace. */
export interface MapViewEngine {
  Map: new (options: MapOptions) => MapLibreMap;
  Marker: new (options?: MarkerOptions) => MapLibreMarker;
  Popup: new (options?: PopupOptions) => MapLibrePopup;
}

export interface MapViewMarker {
  id: MapViewMarkerId;
  coordinates: MapViewCoordinates;
  label: string;
  description?: string;
  tone?: MapViewMarkerTone;
  /** Set to false when the marker must not open its standard text popup. */
  popup?: boolean;
}

export interface MapViewState {
  center: [longitude: number, latitude: number];
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface MapViewProps {
  /** Accessible name applied to the interactive map canvas. */
  ariaLabel: string;
  /** Keyboard instructions or a short data summary for the map. */
  ariaDescription?: string;
  /** Imported MapLibre namespace. Kept explicit so MapLibre remains an optional dependency. */
  engine: MapViewEngine;
  /** MapLibre initialization options except for container. Options are applied again when revision changes. */
  options: MapViewOptions;
  markers?: readonly MapViewMarker[];
  selectedMarkerId?: MapViewMarkerId;
  height?: string | number;
  loading?: boolean;
  loadingLabel?: string;
  empty?: boolean;
  emptyLabel?: string;
  error?: string;
  showControls?: boolean;
  controlsLabel?: string;
  zoomInLabel?: string;
  zoomOutLabel?: string;
  resetLabel?: string;
  /** Recreate the map after mutating an options object in place. */
  revision?: number | string;
}

export interface MapViewEmits {
  error: [error: unknown];
  markerClick: [marker: MapViewMarker];
  moveEnd: [state: MapViewState];
  ready: [map: MapLibreMap];
}

export interface MapViewSlots {
  empty?: () => VNodeChild;
  error?: (props: { error?: string }) => VNodeChild;
  loading?: () => VNodeChild;
  overlay?: (props: { map?: MapLibreMap }) => VNodeChild;
}

export const mapViewErrorMessage = (error: unknown) =>
  error instanceof Error && error.message.trim() ? error.message : "The map could not be rendered.";

export const mapViewHeight = (height: string | number) =>
  typeof height === "number"
    ? Number.isFinite(height) && height > 0 ? `${height}px` : "28rem"
    : height.trim() || "28rem";

export const mapViewState = (map: MapLibreMap): MapViewState => {
  const center = map.getCenter();
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
};
