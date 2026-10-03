import { sidebarFeatureExamples } from "./sidebar-feature-examples";

export const barrelCode = 'import { Sidebar } from "@dicehub/kappa";';
export const granularCode = 'import { Sidebar } from "@dicehub/kappa/components/sidebar";';
export const previewCode = `<script setup>
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Folder, House } from "@lucide/vue";
</script>

<template>
  <Sidebar.Provider style="height: 24rem">
    <Sidebar.Root label="Workspace navigation">
      <Sidebar.Header>Workspace <Sidebar.Close /></Sidebar.Header>
      <Sidebar.Content aria-label="Workspace links">
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton href="/overview" :icon="House" tooltip="Overview" active>
              Overview
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton href="/projects" :icon="Folder" tooltip="Projects">
              Projects
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Content>
    </Sidebar.Root>
    <main style="flex: 1; min-width: 0">
      <Sidebar.Trigger />
      <!-- Application content -->
    </main>
  </Sidebar.Provider>
</template>`;

export const nestedCode = `<Sidebar.Menu>
  <Sidebar.MenuItem>
    <Sidebar.Collapsible default-open>
      <Sidebar.CollapsibleTrigger as-child>
        <Sidebar.MenuButton :icon="Box" tooltip="Mesh">
          Mesh <Sidebar.MenuChevron />
        </Sidebar.MenuButton>
      </Sidebar.CollapsibleTrigger>
      <Sidebar.CollapsibleContent>
        <Sidebar.MenuSub>
          <Sidebar.MenuSubItem>
            <Sidebar.MenuButton href="/mesh/geometry">Geometry</Sidebar.MenuButton>
          </Sidebar.MenuSubItem>
        </Sidebar.MenuSub>
      </Sidebar.CollapsibleContent>
    </Sidebar.Collapsible>
  </Sidebar.MenuItem>
</Sidebar.Menu>`;

export const examples = [
  ...sidebarFeatureExamples,
  { id: "compact", title: "Compact", description: "28px desktop rows for dense navigation. Mobile rows keep 44px touch targets.", code: '<Sidebar.Provider compact>\n  <!-- The same Sidebar parts -->\n</Sidebar.Provider>' },
  { id: "collapsed", title: "Icon Collapse", description: "Start with an icon rail. Tooltips appear on hover and keyboard focus. Activating a nested section expands the rail.", code: '<Sidebar.Provider :default-open="false">\n  <!-- Give each top-level item an icon and tooltip. -->\n</Sidebar.Provider>' },
  { id: "offcanvas", title: "Offcanvas", description: "Hide the entire desktop Sidebar. Keep a Trigger outside it so users can reopen it.", code: '<Sidebar.Provider collapsible="offcanvas">\n  <Sidebar.Root label="Project navigation">…</Sidebar.Root>\n  <main><Sidebar.Trigger />…</main>\n</Sidebar.Provider>' },
  { id: "static", title: "Non-collapsible", description: "Keep desktop navigation expanded. Small viewports still use the accessible mobile drawer.", code: '<Sidebar.Provider collapsible="none">…</Sidebar.Provider>' },
  { id: "controlled", title: "Controlled State", description: "Control desktop and mobile state separately. Lock state to test a parent that rejects a desktop change request.", code: `<script setup>
import { ref } from "vue";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
const open = ref(true);
const mobileOpen = ref(false);
</script>
<template>
  <Sidebar.Provider v-model:open="open" v-model:mobile-open="mobileOpen">
    <!-- Sidebar and application content -->
  </Sidebar.Provider>
</template>` },
  { id: "end", title: "End Placement", description: "Logical end placement follows the text direction. Drag the separator left to grow this Sidebar. Home grows it; End collapses it, following Ark panel order.", code: '<Sidebar.Provider side="end" resizable :default-width="240">\n  <Sidebar.Root><Sidebar.Content>…</Sidebar.Content><Sidebar.ResizeHandle /></Sidebar.Root>\n  <main style="flex: 1; min-width: 0"><Sidebar.Trigger />…</main>\n</Sidebar.Provider>' },
  { id: "rtl", title: "Right-to-left", description: "Use DirectionProvider for Ark behavior and dir for text and layout. Start becomes the right edge.", code: `<DirectionProvider locale="ar">
  <Sidebar.Provider dir="rtl" resizable :default-width="240">
    <Sidebar.Root label="التنقل الرئيسي">…<Sidebar.ResizeHandle /></Sidebar.Root>
    <main><Sidebar.Trigger />…</main>
  </Sidebar.Provider>
</DirectionProvider>` },
  { id: "mobile", title: "Mobile Drawer", description: "Open the drawer inside this resizable viewport. It starts at the preview's left edge, not at the edge of the documentation page. Tab stays inside the drawer. Escape, Close, and the backdrop dismiss it. Open example tests the same composition in a full browser tab.", code: '<Sidebar.Provider :mobile-breakpoint="10000">\n  <Sidebar.Root label="Project navigation">\n    <Sidebar.Header>Project <Sidebar.Close /></Sidebar.Header>\n    <!-- Navigation -->\n  </Sidebar.Root>\n  <main><Sidebar.Trigger />…</main>\n</Sidebar.Provider>' },
  { id: "full-screen-mobile", title: "Full-screen Mobile", description: "Resize the viewport, then open the full-screen navigation. The drawer fills only that viewport, so the documentation stays visible. Try namespace and profile menus, Quick search, and a nested page such as Refinement. Its breadcrumb remains visible after the drawer closes.", code: '<Sidebar.Provider :mobile-breakpoint="10000">\n  <Sidebar.Root label="Project navigation" full-screen-on-mobile>\n    <Sidebar.Header>Project <Sidebar.Close /></Sidebar.Header>\n    <!-- Navigation, namespace and profile menus -->\n  </Sidebar.Root>\n  <main><Sidebar.Trigger /> Engineering / Overview</main>\n</Sidebar.Provider>' },
  { id: "scrollable", title: "Long Navigation", description: "Header and Footer stay visible while Content scrolls. Long labels do not change the width.", code: '<Sidebar.Provider style="height: 24rem">\n  <Sidebar.Root label="Reports">\n    <Sidebar.Header>Reports</Sidebar.Header>\n    <Sidebar.Content aria-label="Report links">…</Sidebar.Content>\n    <Sidebar.Footer><Sidebar.MenuLabel>Casey Rivera</Sidebar.MenuLabel></Sidebar.Footer>\n  </Sidebar.Root>\n  <main><Sidebar.Trigger />…</main>\n</Sidebar.Provider>' },
  { id: "loading", title: "Loading", description: "Deterministic placeholder rows with an accessible loading status. Motion stops under reduced-motion preferences.", code: '<Sidebar.Root label="Project navigation">\n  <Sidebar.Header>Project</Sidebar.Header>\n  <Sidebar.Loading v-if="loading" :rows="5" />\n  <Sidebar.Content v-else aria-label="Project links">…</Sidebar.Content>\n</Sidebar.Root>' },
] as const;

export const providerProps = [
  ["open / defaultOpen", "boolean", "undefined / true", "Controlled or initial desktop expanded state."],
  ["mobileOpen / defaultMobileOpen", "boolean", "undefined / false", "Independent controlled or initial mobile drawer state."],
  ["collapsible", '"icon" | "offcanvas" | "none"', '"icon"', "Desktop collapse mode. none ignores desktop collapse requests."],
  ["side", '"start" | "end"', '"start"', "Logical edge. End placement orders the desktop Sidebar after the application content."],
  ["compact", "boolean", "false", "28px instead of 32px minimum desktop rows. Mobile remains 44px."],
  ["mobileBreakpoint", "number", "768", "Viewport widths below this many pixels use a drawer. Zero disables mobile mode."],
  ["width / collapsedWidth / mobileWidth", "CSS length", '"16.25rem" / "3.25rem" / "18rem"', "Expanded desktop, icon rail, and mobile widths. Mobile width leaves at least 3rem for the backdrop."],
  ["resizable", "boolean", "false", "Enable desktop resizing through ResizeHandle. The numeric resize width replaces the fixed width prop."],
  ["resizeWidth / defaultWidth", "number (px)", "undefined / 260", "Controlled or initial expanded resize width. Resize emits requests; a controlled parent can reject them."],
  ["minWidth / maxWidth", "number (px)", "180 / 400", "Expanded resize bounds. A collapsed icon rail can be smaller than minWidth."],
  ["peekable", "boolean", "false", "Hover or focus temporarily expands a collapsed icon rail. Not used on mobile or in offcanvas/none modes."],
  ["id", "string", "Vue useId()", "Stable ID prefix for navigation and dialog relationships. Set IDs here, not on Root."],
] as const;

export const partProps = [
  ["Root", "label", '"Main navigation"', "Accessible navigation and mobile dialog name. Give multiple Sidebars distinct names."],
  ["Root", "fullScreenOnMobile", "false", "Mobile dialog covers the viewport."],
  ["Trigger", "expandLabel / collapseLabel / openLabel / closeLabel", "English action labels", "Optional localized labels for the built-in icon. Custom content must provide its own accessible name."],
  ["Trigger", "disabled / asChild", "false", "Disable the action or compose it with a custom button."],
  ["Close", "label / asChild", '"Close sidebar" / false', "Mobile-only close action. Hidden on desktop."],
  ["MenuButton", "href / asChild", "undefined / false", "A native link when href is set; otherwise a button. asChild accepts a router link or native element."],
  ["MenuButton", "active / disabled", "false", "Current-page styling and aria-current; disabled controls block activation and leave the tab order."],
  ["MenuButton", "icon / tooltip", "undefined", "Vue icon component (or #icon slot), and optional collapsed-rail tooltip."],
  ["Collapsible", "open / defaultOpen / disabled / id", "undefined / false / false / generated", "Ark disclosure behavior with controlled and uncontrolled state. Sections retain their open preference during icon collapse."],
  ["CollapsibleTrigger / CollapsibleContent", "asChild", "false", "Compose Ark parts with Sidebar.MenuButton or a custom element."],
  ["Loading", "rows / label", '5 / "Loading navigation"', "1–20 placeholder rows and a localized accessible status name."],
  ["ResizeHandle", "label / disabled", '"Resize sidebar" / false', "Focus-visible desktop separator. Ark handles pointer and keyboard resizing. In offcanvas mode, reopen with an external Trigger."],
  ["SlidingViews", "activeKey / direction", 'required / "left"', "Controlled active view key and physical transition direction (left or right). Reverse direction for back navigation."],
  ["SlidingView", "value / label", "required / value", "Matching view key and accessible group name. Inactive views stay mounted but are hidden and inert."],
  ["Structural parts", "asChild", "false", "Header, Footer, Content, Group, GroupLabel, Menu, MenuItem, MenuSub, MenuSubItem, MenuLabel, MenuBadge, and Separator forward attributes to their semantic element."],
] as const;

export const routingCode = `<Sidebar.Context v-slot="{ setMobileOpen }">
  <Sidebar.MenuButton href="/projects" @click="navigate">
    Projects
  </Sidebar.MenuButton>
  <!-- Close only after the router accepts navigation: setMobileOpen(false). -->
</Sidebar.Context>

<!-- Use your router component through as-child. MenuLabel hides only visually in the rail. -->
<Sidebar.MenuButton as-child tooltip="Projects">
  <RouterLink to="/projects">
    <Folder aria-hidden="true" />
    <Sidebar.MenuLabel>Projects</Sidebar.MenuLabel>
  </RouterLink>
</Sidebar.MenuButton>`;
