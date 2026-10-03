import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { SIDEBAR_DEFAULTS, resolveSidebarBreakpoint, resolveSidebarLoadingRows, resolveSidebarWidthBounds, clampSidebarWidth } from "./sidebar.ts";

const source = name => readFileSync(new URL(name, import.meta.url), "utf8");

test("sidebar defaults keep desktop and mobile state separate", () => {
  assert.equal(SIDEBAR_DEFAULTS.defaultOpen, true);
  assert.equal(SIDEBAR_DEFAULTS.defaultMobileOpen, false);
  assert.equal(SIDEBAR_DEFAULTS.collapsible, "icon");
  assert.equal(SIDEBAR_DEFAULTS.side, "start");
  assert.equal(SIDEBAR_DEFAULTS.compact, false);
  assert.equal(SIDEBAR_DEFAULTS.mobileBreakpoint, 768);
});

test("sidebar bounds dynamic media queries and loading placeholders", () => {
  assert.equal(resolveSidebarBreakpoint(0), 0);
  assert.equal(resolveSidebarBreakpoint(-30), 0);
  assert.equal(resolveSidebarBreakpoint(9999), 9999);
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.equal(resolveSidebarBreakpoint(value), 768);
    assert.equal(resolveSidebarLoadingRows(value), 5);
  }
  assert.equal(resolveSidebarLoadingRows(-1), 1);
  assert.equal(resolveSidebarLoadingRows(1000), 20);
  assert.equal(resolveSidebarLoadingRows(4.8), 4);
});

test("sidebar delegates modal and disclosure behavior to Ark UI", () => {
  assert.match(source("SidebarProvider.vue"), /@ark-ui\/vue\/drawer/);
  assert.match(source("SidebarProvider.vue"), /useId\(/);
  assert.match(source("SidebarProvider.vue"), /removeEventListener\("change"/);
  assert.match(source("Sidebar.vue"), /<ArkDrawer.Content/);
  assert.match(source("Sidebar.vue"), /:draggable="false"/);
  assert.match(source("SidebarCollapsible.vue"), /@ark-ui\/vue\/collapsible/);
  assert.match(source("sidebar-resize.ts"), /@ark-ui\/vue\/splitter/);
  assert.doesNotMatch(source("SidebarResizeHandle.vue"), /onPointerDown|onKeyDown|addEventListener/);
  assert.doesNotMatch(source("SidebarProvider.vue"), /localStorage|sessionStorage|document.cookie/);
});

test("sidebar styles preserve semantic tokens, compact targets and hidden state", () => {
  const css = source("sidebar.css");
  for (const token of ["control", "default", "subtle", "line", "tint", "focus", "font-sans"]) {
    assert.ok(css.includes(`--kappa-${token}`), token);
  }
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /forced-colors: active/);
  assert.match(css, /min-block-size: 1\.75rem/);
  assert.match(css, /min-block-size: 2\.75rem/);
  assert.match(css, /clip-path: inset\(50%\)/);
  assert.match(source("Sidebar.vue"), /:inert=/);
  assert.doesNotMatch(css, /data-mode=/);
  assert.doesNotMatch(css, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("sidebar exposes explicit native list semantics and all compound parts", () => {
  const barrel = source("index.ts");
  for (const part of ["Provider", "Root", "Context", "Trigger", "Close", "Content", "Header", "Footer", "Menu", "MenuItem", "MenuButton", "MenuSub", "MenuSubItem", "MenuLabel", "MenuBadge", "Collapsible", "CollapsibleTrigger", "CollapsibleContent", "MenuChevron", "Loading", "ResizeHandle", "SlidingView", "SlidingViews"]) {
    assert.ok(barrel.includes(`${part}: Sidebar${part}`), part);
  }
  for (const [file, tag] of [["Menu", "ul"], ["MenuItem", "li"], ["MenuSub", "ul"], ["MenuSubItem", "li"]]) {
    assert.ok(source(`Sidebar${file}.vue`).includes(`<ark.${tag}`));
  }
});

test("resize widths remain finite and bounded", () => {
  assert.deepEqual(resolveSidebarWidthBounds(NaN, Infinity), { minWidth: 180, maxWidth: 400 });
  assert.deepEqual(resolveSidebarWidthBounds(-10, -20), { minWidth: 1, maxWidth: 1 });
  assert.deepEqual(resolveSidebarWidthBounds(300, 200), { minWidth: 300, maxWidth: 300 });
  assert.equal(clampSidebarWidth(140, 180, 400), 180);
  assert.equal(clampSidebarWidth(800, 180, 400), 400);
  assert.equal(clampSidebarWidth(NaN, 180, 400), 260);
});

test("sidebar works without an application locale provider", () => {
  for (const file of ["Sidebar.vue", "SidebarMenuButton.vue", "SidebarResizeHandle.vue", "sidebar-resize.ts"]) {
    assert.match(source(file), /useLocaleContext\(DEFAULT_LOCALE\)/, file);
  }
});
