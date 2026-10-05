export type NavLink = {
  description: string;
  href: string;
  label: string;
  section?: string;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

export type DocsSearchKind = "block" | "chart" | "component" | "guide";

export type DocsSearchItem = NavLink & {
  kind: DocsSearchKind;
  section: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const topLevel = (label: string, description: string): NavLink => ({
  label,
  href: label === "Home" ? "/docs" : `/docs/${slugify(label)}`,
  description,
});

const hrefOverrides: Record<string, string> = {
  "Blocks:Application Shell": "/docs/blocks/sidebar",
  "Charts:Custom Chart": "/docs/charts/custom",
  "Components:Code Highlighted": "/docs/components/code-highlighted",
  "Components:Input Area": "/docs/components/input-area",
  "Components:Input Group": "/docs/components/input-group",
  "Components:Menu Bar": "/docs/components/menu-bar",
};

const grouped = (section: string, baseHref: string, labels: string[]): NavGroup => ({
  label: section,
  links: labels.map((label) => ({
    label,
    href:
      hrefOverrides[`${section}:${label}`] ??
      (label === section ? baseHref : `${baseHref}/${slugify(label)}`),
    description: `${label} documentation and examples.`,
    section,
  })),
});

export const primaryNav: NavLink[] = [
  topLevel("Home", "Kappa documentation home."),
  topLevel("Components", "Browse Kappa component documentation."),
  topLevel("Blocks", "Browse reusable Kappa application layouts."),
  topLevel("Installation", "Install Kappa in a Vue application."),
  topLevel("Contributing", "Contribute to Kappa development and documentation."),
  topLevel("Colors", "Use Kappa semantic tokens and themes."),
  topLevel("Accessibility", "Build accessible interfaces with Kappa."),
  topLevel("Registry", "Use Kappa component metadata."),
  topLevel("Changelog", "Review Kappa releases and changes."),
];

export const componentNav = grouped("Components", "/docs/components", [
  "Accordion",
  "Activity Feed",
  "Aspect Ratio",
  "Attachment",
  "Autocomplete",
  "Avatar",
  "Badge",
  "Banner",
  "Breadcrumbs",
  "Button",
  "Button Group",
  "Card",
  "Checkbox",
  "Client Only",
  "Clipboard Text",
  "Code Highlighted",
  "Collapsible",
  "Collapsible Section",
  "Color Picker",
  "Combobox",
  "Command Palette",
  "Content Loader",
  "Context Menu",
  "Data Grid",
  "Date Picker",
  "Dialog",
  "Dialog Layout",
  "dicehub logo",
  "Diff Viewer",
  "Direction Provider",
  "Download Trigger",
  "Drag Selection",
  "Drawer",
  "Dropdown",
  "Editable",
  "Empty",
  "Expandable Text",
  "Field",
  "Fieldset",
  "File Upload",
  "Filter Bar",
  "Floating Panel",
  "Flow",
  "Format",
  "Grid",
  "Highlight",
  "Hover Card",
  "Image Cropper",
  "Inline Copy Text",
  "Input",
  "Input Area",
  "Input Group",
  "Input OTP",
  "Item",
  "Kbd",
  "Label",
  "Layer Card",
  "Link",
  "Loader",
  "Matrix Loader",
  "Menu Bar",
  "Meter",
  "Native Select",
  "Navigation Menu",
  "Number Input",
  "Pagination",
  "Popover",
  "Presence",
  "Progress",
  "Progress Circle",
  "Property List",
  "QR Code",
  "Radio",
  "Rating",
  "Resizable",
  "Scroll Area",
  "Select",
  "Selection List",
  "Sensitive Input",
  "Separator",
  "Sidebar",
  "Skeleton Line",
  "Slider",
  "Steps",
  "Switch",
  "Table",
  "Table of Contents",
  "Tabs",
  "Tag Input",
  "Text",
  "Timer",
  "Toast",
  "Toggle",
  "Toggle Group",
  "Toolbar",
  "Tooltip",
  "Tree View",
]);

export const navGroups: NavGroup[] = [
  componentNav,
  grouped("Charts", "/docs/charts", ["Charts", "Timeseries", "Maps"]),
  grouped("Blocks", "/docs/blocks", ["Application Shell", "Login", "Signup", "Settings", "Resource List", "File Browser", "Delete Resource", "Resource Picker", "Message Composer", "Workspace Switcher"]),
];

const implementedPages = new Set([
  "/docs/blocks/delete-resource",
  "/docs/blocks/file-browser",
  "/docs/blocks/message-composer",
  "/docs/blocks/resource-picker",
  "/docs/components/content-loader",
  "/docs/components/filter-bar",
  "/docs/components/property-list",
  "/docs/blocks",
  "/docs/blocks/login",
  "/docs/blocks/resource-list",
  "/docs/blocks/signup",
  "/docs/blocks/settings",
  "/docs/blocks/sidebar",
  "/docs/blocks/workspace-switcher",
  "/docs/components/accordion",
  "/docs/components/activity-feed",
  "/docs/components/aspect-ratio",
  "/docs/components/attachment",
  "/docs/components/autocomplete",
  "/docs/components/avatar",
  "/docs/components/badge",
  "/docs/components/banner",
  "/docs/components/breadcrumbs",
  "/docs/components/button",
  "/docs/components/button-group",
  "/docs/components/card",
  "/docs/components/checkbox",
  "/docs/components/client-only",
  "/docs/components/clipboard-text",
  "/docs/components/code-highlighted",
  "/docs/components/collapsible",
  "/docs/components/collapsible-section",
  "/docs/components/color-picker",
  "/docs/components/combobox",
  "/docs/components/command-palette",
  "/docs/components/context-menu",
  "/docs/components/data-grid",
  "/docs/components/date-picker",
  "/docs/components/dialog",
  "/docs/components/dialog-layout",
  "/docs/components/diff-viewer",
  "/docs/components/direction-provider",
  "/docs/components/dicehub-logo",
  "/docs/components/download-trigger",
  "/docs/components/drag-selection",
  "/docs/components/drawer",
  "/docs/components/dropdown",
  "/docs/components/editable",
  "/docs/components/empty",
  "/docs/components/expandable-text",
  "/docs/components/field",
  "/docs/components/fieldset",
  "/docs/components/file-upload",
  "/docs/components/floating-panel",
  "/docs/components/flow",
  "/docs/components/format",
  "/docs/components/grid",
  "/docs/components/highlight",
  "/docs/components/hover-card",
  "/docs/components/image-cropper",
  "/docs/components/inline-copy-text",
  "/docs/components/input",
  "/docs/components/input-area",
  "/docs/components/input-group",
  "/docs/components/input-otp",
  "/docs/components/item",
  "/docs/components/kbd",
  "/docs/components/label",
  "/docs/components/layer-card",
  "/docs/components/link",
  "/docs/components/loader",
  "/docs/components/matrix-loader",
  "/docs/components/menu-bar",
  "/docs/components/meter",
  "/docs/components/native-select",
  "/docs/components/navigation-menu",
  "/docs/components/number-input",
  "/docs/components/pagination",
  "/docs/components/popover",
  "/docs/components/presence",
  "/docs/components/progress",
  "/docs/components/progress-circle",
  "/docs/components/qr-code",
  "/docs/components/radio",
  "/docs/components/rating",
  "/docs/components/resizable",
  "/docs/components/scroll-area",
  "/docs/components/select",
  "/docs/components/selection-list",
  "/docs/components/sensitive-input",
  "/docs/components/separator",
  "/docs/components/sidebar",
  "/docs/components/skeleton-line",
  "/docs/components/slider",
  "/docs/components/steps",
  "/docs/components/switch",
  "/docs/components/table",
  "/docs/components/table-of-contents",
  "/docs/components/tag-input",
  "/docs/components/tabs",
  "/docs/components/text",
  "/docs/components/timer",
  "/docs/components/toast",
  "/docs/components/toggle",
  "/docs/components/toggle-group",
  "/docs/components/toolbar",
  "/docs/components/tooltip",
  "/docs/components/tree-view",
  "/docs/charts",
  "/docs/charts/timeseries",
  "/docs/charts/maps",
  "/docs/changelog",
  "/docs/colors",
  "/docs/contributing",
  "/docs/accessibility",
  "/docs/registry",
]);

export const implementedComponentLinks = componentNav.links.filter((link) =>
  implementedPages.has(link.href),
);

export const placeholderPages: NavLink[] = [
  ...primaryNav.filter(
    (link) => !["/docs", "/docs/components", "/docs/installation"].includes(link.href),
  ),
  ...navGroups.flatMap((group) => group.links),
].filter((link) => !implementedPages.has(link.href));

const searchItems = [
  ...primaryNav.map((link): DocsSearchItem => ({ ...link, kind: link.href === "/docs/blocks" ? "block" : "guide", section: link.href === "/docs/blocks" ? "Blocks" : "Guides" })),
  ...navGroups.flatMap((group) =>
    group.links.map(
      (link): DocsSearchItem => ({
        ...link,
        kind:
          group.label === "Components"
            ? "component"
            : group.label === "Charts"
              ? "chart"
              : "block",
        section: group.label,
      }),
    ),
  ),
];

export const docsSearchItems = [...new Map(searchItems.map((item) => [item.href, item])).values()];
