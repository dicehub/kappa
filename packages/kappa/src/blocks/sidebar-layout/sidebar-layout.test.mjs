import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { SIDEBAR_LAYOUT_DEFAULTS, SIDEBAR_LAYOUT_VARIANTS, sidebarLayoutDefaultOpen, sidebarLayoutDefaultWidth } from "./sidebar-layout.ts";

const source = name => readFileSync(new URL(name, import.meta.url), "utf8");

test("six layout presets preserve rail and split defaults", () => {
  assert.deepEqual(SIDEBAR_LAYOUT_VARIANTS, ["workspace", "rail", "inset", "floating", "split", "header"]);
  assert.equal(SIDEBAR_LAYOUT_DEFAULTS.variant, "workspace");
  for (const variant of SIDEBAR_LAYOUT_VARIANTS) {
    assert.equal(sidebarLayoutDefaultOpen(variant), variant !== "rail");
    assert.equal(sidebarLayoutDefaultWidth(variant), variant === "split" ? 352 : 260);
  }
});

test("layouts compose Sidebar and forward its controlled events and slots", () => {
  const component = source("SidebarLayout.vue");
  for (const part of ["Provider", "Root", "Context", "Header", "Content", "Footer", "Trigger", "Close", "ResizeHandle"]) {
    assert.ok(component.includes(`<Sidebar.${part}`), part);
  }
  for (const event of ["update:open", "openChange", "update:mobileOpen", "mobileOpenChange", "update:resizeWidth", "resize", "resizeEnd"]) {
    assert.ok(component.includes(`emit('${event}'`), event);
  }
  for (const slot of ["header", "navigation", "footer", "toolbar", "secondary"]) {
    assert.ok(component.includes(`name="${slot}"`), slot);
  }
  assert.match(component, /open: undefined, mobileOpen: undefined, defaultOpen: undefined/);
  assert.match(component, /props.defaultOpen \?\? sidebarLayoutDefaultOpen/);
  assert.doesNotMatch(component, /localStorage|fetch\(|onPointerDown|@ark-ui/);
});

test("block styling is scoped and preserves mobile and hidden secondary content", () => {
  const css = source("sidebar-layout.css");
  assert.match(css, /\.kappa-sidebar-layout__secondary\[hidden\] \{ display: none/);
  assert.match(css, /:not\(\[data-mobile\]\)/);
  assert.match(css, /\[data-mobile\]\[data-layout="split"\]/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|rgba?\(|data-mode/);
  assert.doesNotMatch(css, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("SidebarLayout is a published block with a generated registry entry", () => {
  const registry = JSON.parse(source("../../registry/component-registry.json"));
  assert.equal(registry.components.SidebarLayout.type, "block");
  assert.equal(registry.components.SidebarLayout.importPath, "@dicehub/kappa/blocks/sidebar-layout");
  const manifest = JSON.parse(source("../../../package.json"));
  assert.equal(manifest.exports["./blocks/*"]["kappa-source"], "./src/blocks/*/index.ts");
  assert.equal(manifest.exports["./blocks/*"].types, "./dist/blocks/*/index.d.ts");
  assert.match(source("../../index.ts"), /export \* from "\.\/blocks"/);
});
