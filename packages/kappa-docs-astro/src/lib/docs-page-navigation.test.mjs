import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { docsPageSequences, getAdjacentDocsPages } from "./docs-page-navigation.ts";
import { docsSearchItems, placeholderPages, primaryNav } from "../data/docs-nav.ts";

const adjacentLabels = (pathname) => {
  const { next, previous } = getAdjacentDocsPages(pathname);
  return { previous: previous?.label, next: next?.label };
};

describe("docs page navigation", () => {
  it("keeps adjacent pages within their documentation section", () => {
    assert.deepEqual(adjacentLabels("/docs/installation"), {
      previous: "Home",
      next: "Contributing",
    });
    assert.deepEqual(adjacentLabels("/docs/components"), {
      previous: undefined,
      next: "Accordion",
    });
    assert.deepEqual(adjacentLabels("/docs/components/accordion"), {
      previous: "Components",
      next: "Activity Feed",
    });
    assert.deepEqual(adjacentLabels("/docs/components/activity-feed"), {
      previous: "Accordion",
      next: "Aspect Ratio",
    });
    assert.deepEqual(adjacentLabels("/docs/components/attachment"), {
      previous: "Aspect Ratio",
      next: "Autocomplete",
    });
    assert.deepEqual(adjacentLabels("/docs/components/button"), {
      previous: "Breadcrumbs",
      next: "Button Group",
    });
    assert.deepEqual(adjacentLabels("/docs/components/button-group"), {
      previous: "Button",
      next: "Card",
    });
    assert.deepEqual(adjacentLabels("/docs/components/card"), {
      previous: "Button Group",
      next: "Checkbox",
    });
    assert.deepEqual(adjacentLabels("/docs/components/checkbox"), {
      previous: "Card",
      next: "Client Only",
    });
    assert.deepEqual(adjacentLabels("/docs/components/client-only"), {
      previous: "Checkbox",
      next: "Clipboard Text",
    });
    assert.deepEqual(adjacentLabels("/docs/components/clipboard-text"), {
      previous: "Client Only",
      next: "Code Highlighted",
    });
    assert.deepEqual(adjacentLabels("/docs/components/breadcrumbs"), {
      previous: "Banner",
      next: "Button",
    });
    assert.deepEqual(adjacentLabels("/docs/components/badge"), {
      previous: "Avatar",
      next: "Banner",
    });
    assert.deepEqual(adjacentLabels("/docs/components/avatar"), {
      previous: "Autocomplete",
      next: "Badge",
    });
    assert.deepEqual(adjacentLabels("/docs/components/dicehub-logo"), {
      previous: "Dialog Layout",
      next: "Diff Viewer",
    });
    assert.deepEqual(adjacentLabels("/docs/components/dialog-layout"), {
      previous: "Dialog",
      next: "dicehub logo",
    });
    assert.deepEqual(adjacentLabels("/docs/components/diff-viewer"), {
      previous: "dicehub logo",
      next: "Direction Provider",
    });
    assert.deepEqual(adjacentLabels("/docs/components/direction-provider"), {
      previous: "Diff Viewer",
      next: "Download Trigger",
    });
    assert.deepEqual(adjacentLabels("/docs/components/download-trigger"), {
      previous: "Direction Provider",
      next: "Drag Selection",
    });
    assert.deepEqual(adjacentLabels("/docs/components/drag-selection"), {
      previous: "Download Trigger",
      next: "Drawer",
    });
    assert.deepEqual(adjacentLabels("/docs/components/drawer"), {
      previous: "Drag Selection",
      next: "Dropdown",
    });
    assert.deepEqual(adjacentLabels("/docs/components/editable"), {
      previous: "Dropdown",
      next: "Empty",
    });
    assert.deepEqual(adjacentLabels("/docs/components/empty"), {
      previous: "Editable",
      next: "Expandable Text",
    });
    assert.deepEqual(adjacentLabels("/docs/components/expandable-text"), {
      previous: "Empty",
      next: "Field",
    });
    assert.deepEqual(adjacentLabels("/docs/components/field"), {
      previous: "Expandable Text",
      next: "Fieldset",
    });
    assert.deepEqual(adjacentLabels("/docs/components/kbd"), {
      previous: "Item",
      next: "Label",
    });
    assert.deepEqual(adjacentLabels("/docs/components/layer-card"), {
      previous: "Label",
      next: "Link",
    });
    assert.deepEqual(adjacentLabels("/docs/components/menu-bar"), {
      previous: "Matrix Loader",
      next: "Meter",
    });
    assert.deepEqual(adjacentLabels("/docs/components/format"), {
      previous: "Flow",
      next: "Grid",
    });
    assert.deepEqual(adjacentLabels("/docs/components/hover-card"), {
      previous: "Highlight",
      next: "Image Cropper",
    });
    assert.deepEqual(adjacentLabels("/docs/components/image-cropper"), {
      previous: "Hover Card",
      next: "Input",
    });
    assert.deepEqual(adjacentLabels("/docs/components/highlight"), {
      previous: "Grid",
      next: "Hover Card",
    });
    assert.deepEqual(adjacentLabels("/docs/components/input-group"), {
      previous: "Input Area",
      next: "Input OTP",
    });
    assert.deepEqual(adjacentLabels("/docs/components/input-otp"), {
      previous: "Input Group",
      next: "Item",
    });
    assert.deepEqual(adjacentLabels("/docs/components/collapsible-section"), {
      previous: "Collapsible",
      next: "Color Picker",
    });
    assert.deepEqual(adjacentLabels("/docs/components/color-picker"), {
      previous: "Collapsible Section",
      next: "Combobox",
    });
    assert.deepEqual(adjacentLabels("/docs/components/content-loader"), {
      previous: "Command Palette",
      next: "Context Menu",
    });
    assert.deepEqual(adjacentLabels("/docs/components/data-grid"), {
      previous: "Context Menu",
      next: "Date Picker",
    });
    assert.deepEqual(adjacentLabels("/docs/components/filter-bar"), {
      previous: "File Upload",
      next: "Floating Panel",
    });
    assert.deepEqual(adjacentLabels("/docs/components/floating-panel"), {
      previous: "Filter Bar",
      next: "Flow",
    });
    assert.deepEqual(adjacentLabels("/docs/components/native-select"), {
      previous: "Meter",
      next: "Number Input",
    });
    assert.deepEqual(adjacentLabels("/docs/components/number-input"), {
      previous: "Native Select",
      next: "Pagination",
    });
    assert.deepEqual(adjacentLabels("/docs/components/progress"), {
      previous: "Presence",
      next: "Progress Circle",
    });
    assert.deepEqual(adjacentLabels("/docs/components/presence"), {
      previous: "Popover",
      next: "Progress",
    });
    assert.deepEqual(adjacentLabels("/docs/components/progress-circle"), {
      previous: "Progress",
      next: "Property List",
    });
    assert.deepEqual(adjacentLabels("/docs/components/property-list"), {
      previous: "Progress Circle",
      next: "QR Code",
    });
    assert.deepEqual(adjacentLabels("/docs/components/qr-code"), {
      previous: "Property List",
      next: "Radio",
    });
    assert.deepEqual(adjacentLabels("/docs/components/scroll-area"), {
      previous: "Resizable",
      next: "Select",
    });
    assert.deepEqual(adjacentLabels("/docs/components/resizable"), {
      previous: "Rating",
      next: "Scroll Area",
    });
    assert.deepEqual(adjacentLabels("/docs/components/rating"), {
      previous: "Radio",
      next: "Resizable",
    });
    assert.deepEqual(adjacentLabels("/docs/components/slider"), {
      previous: "Skeleton Line",
      next: "Steps",
    });
    assert.deepEqual(adjacentLabels("/docs/components/steps"), {
      previous: "Slider",
      next: "Switch",
    });
    assert.deepEqual(adjacentLabels("/docs/components/tag-input"), {
      previous: "Tabs",
      next: "Text",
    });
    assert.deepEqual(adjacentLabels("/docs/components/timer"), {
      previous: "Text",
      next: "Toast",
    });
    assert.deepEqual(adjacentLabels("/docs/components/toggle-group"), {
      previous: "Toggle",
      next: "Toolbar",
    });
    assert.deepEqual(adjacentLabels("/docs/components/tooltip"), {
      previous: "Toolbar",
      next: "Tree View",
    });
    assert.deepEqual(adjacentLabels("/docs/components/tree-view"), {
      previous: "Tooltip",
      next: undefined,
    });
    assert.deepEqual(adjacentLabels("/docs/charts"), {
      previous: undefined,
      next: "Timeseries",
    });
    assert.deepEqual(adjacentLabels("/docs/blocks/delete-resource"), {
      previous: "File Browser",
      next: "Resource Picker",
    });
    assert.deepEqual(adjacentLabels("/docs/blocks/resource-picker"), {
      previous: "Delete Resource",
      next: "Message Composer",
    });
    assert.deepEqual(adjacentLabels("/docs/blocks/message-composer"), {
      previous: "Resource Picker",
      next: undefined,
    });
    assert.deepEqual(adjacentLabels("/docs/blocks"), { previous: undefined, next: "Application Shell" });
    assert.deepEqual(adjacentLabels("/docs/blocks/sidebar"), { previous: "Blocks", next: "Login" });
    assert.deepEqual(adjacentLabels("/docs/blocks/login"), { previous: "Application Shell", next: "Signup" });
    assert.deepEqual(adjacentLabels("/docs/blocks/signup"), { previous: "Login", next: "Resource List" });
    assert.deepEqual(adjacentLabels("/docs/blocks/resource-list"), {
      previous: "Signup",
      next: "File Browser",
    });
    assert.deepEqual(adjacentLabels("/docs/blocks/file-browser"), {
      previous: "Resource List",
      next: "Delete Resource",
    });
  });

  it("normalizes URLs and ignores unknown pages", () => {
    assert.deepEqual(
      adjacentLabels("/docs/components/button/?preview=true#example"),
      adjacentLabels("/docs/components/button"),
    );
    assert.deepEqual(getAdjacentDocsPages("/docs/not-a-page"), {});
  });

  it("distinguishes Application Shell blocks from the Sidebar component in search", () => {
    const block = docsSearchItems.find(item => item.href === "/docs/blocks/sidebar");
    const component = docsSearchItems.find(item => item.href === "/docs/components/sidebar");
    assert.equal(block?.label, "Application Shell");
    assert.equal(block?.kind, "block");
    assert.equal(component?.label, "Sidebar");
    assert.equal(component?.kind, "component");
  });

  it("contains every documentation page exactly once", () => {
    const hrefs = docsPageSequences.flatMap((sequence) => sequence.map((link) => link.href));
    assert.equal(docsPageSequences.length, 4);
    assert.equal(hrefs.length, 115);
    assert.equal(new Set(hrefs).size, hrefs.length);
  });

  it("lists only available guide topics and serves the implemented guides", () => {
    const guidePaths = ["/docs/contributing", "/docs/accessibility", "/docs/registry"];
    for (const href of guidePaths) {
      assert.ok(primaryNav.some((link) => link.href === href));
      assert.ok(docsSearchItems.some((item) => item.href === href));
      assert.ok(!placeholderPages.some((link) => link.href === href));
    }
    assert.ok(!primaryNav.some((link) => ["/docs/cli", "/docs/figma-resources"].includes(link.href)));
  });
});
