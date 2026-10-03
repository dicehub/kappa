import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { mapViewErrorMessage, mapViewHeight } from "./map-view.ts";

const source = (name) => readFileSync(new URL(name, import.meta.url), "utf8");

test("normalizes public presentation values", () => {
  assert.equal(mapViewHeight(320), "320px");
  assert.equal(mapViewHeight("42vh"), "42vh");
  assert.equal(mapViewHeight(-1), "28rem");
  assert.equal(mapViewHeight("  "), "28rem");
  assert.equal(mapViewErrorMessage(new Error("WebGL is unavailable")), "WebGL is unavailable");
  assert.equal(mapViewErrorMessage(null), "The map could not be rendered.");
});

test("owns MapLibre lifecycle, markers, controls, and accessible states", () => {
  const component = source("./MapView.vue");
  const styles = source("./map-view.css");
  const barrel = source("./index.ts");
  const componentsBarrel = source("../index.ts");
  const manifest = JSON.parse(source("../../../package.json"));

  assert.match(component, /new props\.engine\.Map/);
  assert.match(component, /new props\.engine\.Marker/);
  assert.match(component, /new props\.engine\.Popup/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /map\.value\.remove\(\)/);
  assert.match(component, /textContent = marker\.label/);
  assert.doesNotMatch(component, /innerHTML|v-html/);
  assert.match(component, /aria-describedby/);
  assert.match(component, /data-slot="map-view-controls"/);
  assert.match(component, /v-if="\$slots\.overlay"/);
  assert.doesNotMatch(component, /\$slots\.overlay && map/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  assert.match(styles, /forced-colors: active/);

  assert.doesNotMatch(componentsBarrel, /\.\/map-view/);
  assert.equal(manifest.peerDependenciesMeta["maplibre-gl"].optional, true);
  for (const name of ["MapView", "MapViewMarker", "MapViewOptions", "mapViewState"]) {
    assert.match(barrel, new RegExp(name));
  }
});
