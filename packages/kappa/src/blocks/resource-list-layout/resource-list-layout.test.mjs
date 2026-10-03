import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  RESOURCE_LIST_LAYOUT_DEFAULTS,
  RESOURCE_LIST_LAYOUT_DENSITIES,
  RESOURCE_LIST_LAYOUT_SIDEBAR_SIDES,
  resolveResourceListLayoutDensity,
  resolveResourceListLayoutSidebarSide,
} from "./resource-list-layout.ts";

const source = name => readFileSync(new URL(name, import.meta.url), "utf8");

test("resource list layouts expose stable options and defensive defaults", () => {
  assert.deepEqual(RESOURCE_LIST_LAYOUT_DENSITIES, ["default", "compact"]);
  assert.deepEqual(RESOURCE_LIST_LAYOUT_SIDEBAR_SIDES, ["start", "end"]);
  assert.deepEqual(RESOURCE_LIST_LAYOUT_DEFAULTS, {
    density: "default",
    sidebarSide: "end",
    stickySidebar: true,
  });
  assert.equal(resolveResourceListLayoutDensity("compact"), "compact");
  assert.equal(resolveResourceListLayoutDensity("dense"), "default");
  assert.equal(resolveResourceListLayoutSidebarSide("start"), "start");
  assert.equal(resolveResourceListLayoutSidebarSide(undefined), "end");
});

test("ResourceListLayout exposes composition slots without application state", () => {
  const component = source("ResourceListLayout.vue");
  for (const slot of ["icon", "title", "description", "actions", "toolbar", "aside"]) {
    assert.ok(component.includes(`name="${slot}"`), slot);
  }
  for (const part of [
    "resource-list-layout",
    "resource-list-layout-header",
    "resource-list-layout-primary",
    "resource-list-layout-toolbar",
    "resource-list-layout-aside",
  ]) {
    assert.ok(component.includes(`data-slot="${part}"`), part);
  }
  assert.doesNotMatch(
    component,
    /fetch\(|useRouter|useRoute|localStorage|sessionStorage|defineModel/,
  );
});

test("resource list layout styling is scoped, responsive, and token based", () => {
  const css = source("resource-list-layout.css");
  assert.match(css, /\.kappa-resource-list-layout\[data-density="compact"\]/);
  assert.match(css, /\.kappa-resource-list-layout\[data-sticky-sidebar\]/);
  assert.match(css, /\.kappa-resource-list-layout\[data-sidebar-side="start"\]/);
  assert.match(
    css,
    /grid-template-columns: var\(--kappa-resource-list-layout-aside-width\) minmax\(0, 1fr\)/,
  );
  assert.match(css, /container-type: inline-size/);
  assert.match(css, /clamp\(1\.25rem, 2cqi, 2rem\)/);
  assert.match(css, /@container kappa-resource-list-layout \(max-width: 64rem\)/);
  assert.match(css, /var\(--kappa-overlay/);
  assert.doesNotMatch(css, /data-mode/);
  assert.doesNotMatch(css, /(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("ResourceListLayout is a published block with a generated registry entry", () => {
  const registry = JSON.parse(source("../../registry/component-registry.json"));
  assert.equal(registry.components.ResourceListLayout?.type, "block");
  assert.equal(
    registry.components.ResourceListLayout?.importPath,
    "@dicehub/kappa/blocks/resource-list-layout",
  );
  const manifest = JSON.parse(source("../../../package.json"));
  assert.equal(
    manifest.exports["./blocks/*"]["kappa-source"],
    "./src/blocks/*/index.ts",
  );
  assert.equal(manifest.exports["./blocks/*"].import, "./dist/blocks/*.js");
});
